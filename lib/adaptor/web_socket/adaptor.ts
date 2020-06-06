import { Adaptor, AdaptorConfigure } from "../../core/adaptor.ts";
import { WebSocketEndpointInput, WebSocketBody, WebSocketMeta } from "./endpoint_input.ts";
import { Router } from "../../core/router.ts";
import { EnlaceServer } from "../../core/server.ts";
import { EndpointInput, Client } from "../../core/endpoint.ts";
import Log from "../../util/log.ts";
import { WebSocketMessage, acceptWebSocket } from "https://deno.land/std/ws/mod.ts";
import { HttpAdaptor } from "../http-adaptor/adaptor.ts";
import { attachWebSocket } from "./attach_middle_ware.ts";
import { rgb24, bold } from "https://deno.land/std/fmt/colors.ts";
import { pathToUrl } from "../../util/path-to-url.ts";

export class WebSocketAdaptor extends Adaptor<WebSocketMeta, WebSocketBody> {
  readonly protocol: string = "WebSocket";
  public router: Router = new Router(this);
  private encoder: TextEncoder = new TextEncoder();

  constructor(
    protected readonly httpAdaptor: HttpAdaptor
  ) { super(); }

  public attachOnServer(server: EnlaceServer, configure: AdaptorConfigure) {
    this.httpAdaptor.router.useMiddleWare("*", attachWebSocket(async (input) => {
      const { conn, r: bufReader, w: bufWriter, headers } = input.meta;
      try {
        const sock = await acceptWebSocket({
          conn, bufReader, bufWriter, headers,
        });
        Log.info(`listen on port ${rgb24(bold(`${configure.port}`), 0xb7b1ff)}`, "WebSocket");
        try {
          for await (const event of sock) {
            const url = pathToUrl(input.meta.proto, input.meta.headers, input.meta.url);
            const inputContent = new WebSocketEndpointInput(url.pathname, sock, event);
            this.clientToInput.set(inputContent.client, inputContent);
            this.didReceiveContent(inputContent, inputContent.client);
          }
        } catch (err) {
          Log.error(`failed to receive frame: ${err}`);
          if (!sock.isClosed) {
            await sock.close(1000).catch(Log.error);
          }
        }
      } catch (err) {
        Log.error(`failed to accept websocket: ${err}`);
        await input.meta.respond({ status: 400 });
      }
    }));
  }

  public sendToClient(client: Client, content: any) {
    const input = this.clientToInput.get(client);
    if (input) {
      const responseUnit8Array = this.encoder.encode(content);
      input.meta.send(responseUnit8Array).then(() => {
        // todo send done
      });
    }
  }

}