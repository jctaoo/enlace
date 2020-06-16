import { serve } from "https://deno.land/std/http/mod.ts";
import {
  Adaptor,
  AdaptorConfig
} from "../../core/mod.ts";
import { EnlaceServer } from "../../core/server.ts";
import { int } from "../../util/mod.ts";
import { HttpEndpointInput, HttpSearchParameter } from "./endpoint_input.ts";
import { path_to_url } from "../../util/path_to_url.ts";
import { Router } from "../../core/router.ts";
import { Log } from "../../util/mod.ts";
import { rgb24, bold } from "https://deno.land/std/fmt/colors.ts";
import { Client } from "../../client.ts";
import { injectable } from "../../decorators/injectable.ts";

@injectable
export class HttpAdaptor extends Adaptor {
  readonly protocol: string = "Http";

  protected port!: int;
  protected host!: string;
  public router: Router = new Router(this);
  private encoder: TextEncoder = new TextEncoder();

  attachOnServer(server: EnlaceServer, config: AdaptorConfig): void {
    super.attachOnServer(server, config);
    this.host = config.host;
    this.port = config.port;
    this.listenOnServer(this.host, this.port).then();
  }

  private async listenOnServer(host: string, port: int) {
    try {
      const s = serve({ port: port, hostname: host });
      Log.info(`listen on ${rgb24(bold(`http://${host}:${port}/`), 0xb7b1ff)}`, "Http");
      for await (const request of s) {
        const url = path_to_url(request.proto, request.headers, request.url);
        const input = new HttpEndpointInput(url.pathname, request);
        const searchParameters: HttpSearchParameter = {};
        url.searchParams.forEach((value, key) => {
          searchParameters[key] = value;
        });
        input.queryParameters = searchParameters;
        this.clientToInput.set(input.client, input);
        this.didReceiveContent(input, input.client);
      }
    } catch (error) {
      const message: string = error.message
      if (message.startsWith("Address already in use")) {
        Log.error(`Port ${this.port} is occupied, enlace will exit.`, 'Http')
        Deno.exit(100)
      }
    }
  }

  public sendToClient(client: Client, content: any) {
    const input = this.clientToInput.get(client);
    if (input && input instanceof HttpEndpointInput) {
      // todo
      let responseUnit8Array = this.encoder.encode(`${content}`);
      // todo more infomation in response
      input.meta.respond({ body: responseUnit8Array })
    } else {
      // todo throw error here
    }
  }
}
