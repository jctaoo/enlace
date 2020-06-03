import { serve } from "https://deno.land/std/http/server.ts";
import { Adaptor, AdaptorConfigure } from "../../core/adaptor.ts";
import { EnlaceServer } from "../../core/server.ts";
import { int } from "../../util/mod.ts";
import {
  HttpEndpointInput,
  HttpBody,
  HttpInputMeta,
  HttpSearchParameter,
} from "./endpoint-input.ts";
import { EndpointInput } from "../../core/endpoint.ts";
import { pathToUrl } from "../../util/path-to-url.ts";
import { Router } from "../../core/router.ts";
import { Log } from "../../util/mod.ts";
import { rgb24, bold } from "https://deno.land/std/fmt/colors.ts";

export class HttpAdaptor extends Adaptor<HttpInputMeta, HttpBody> {
  readonly protocol: string = "Http";

  protected port!: int;
  protected host!: string;
  protected server!: EnlaceServer;
  public router: Router = new Router();

  attachOnServer(
    server: EnlaceServer,
    configure: AdaptorConfigure,
  ): void {
    this.host = configure.host;
    this.port = configure.port;
    this.server = server;
    this.listenOnServer(this.host, this.port).then();
  }

  private async listenOnServer(host: string, port: int) {
    const s = serve({ port: port, hostname: host });
    Log.info(`listen on ${rgb24(bold(`http://${host}:${port}/`), 0xb7b1ff)}`, "Http");
    for await (const request of s) {
      const url = pathToUrl(request.proto, request.headers, request.url);
      const input = new HttpEndpointInput(url.pathname, request);
      const searchParameters: HttpSearchParameter = {};
      url.searchParams.forEach((value, key) => {
        searchParameters[key] = value;
      });
      input.parameters = searchParameters;
      this.didReceiveContent(input);
    }
  }

  public sendToClient(
    input: EndpointInput<HttpInputMeta, HttpBody>,
    content: any,
  ): void {
    input.meta.respond({ body: `${content}` });
  }
}
