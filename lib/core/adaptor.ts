import { int } from "../util/mod.ts";
import { EnlaceServer } from "../core/server.ts";
import { EndpointInput } from "./endpoint.ts";
import { Router } from "../core/router.ts";

export interface AdaptorConfigure {
  host: string;
  port: int;
}

export abstract class Adaptor<InputMeta, InputBody> {
  abstract router: Router;
  abstract protocol: string;
  abstract attachOnServer(
    server: EnlaceServer,
    configure: AdaptorConfigure,
  ): void;
  abstract sendToClient(
    input: EndpointInput<InputMeta, InputBody>,
    content: any,
  ): void;

  public didReceiveContent: (
    input: EndpointInput<InputMeta, InputBody>,
  ) => void = () => {};
  protected onStart(): void {}
  protected onDispose(): void {}
}
