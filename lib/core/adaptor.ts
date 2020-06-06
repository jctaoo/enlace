import { int } from "../util/mod.ts";
import { EnlaceServer } from "../core/server.ts";
import { EndpointInput, Client } from "./endpoint.ts";
import { Router } from "../core/router.ts";

export interface AdaptorConfigure {
  host: string;
  port: int;
}

export abstract class Adaptor<InputMeta, InputBody> {
  public server?: EnlaceServer;
  abstract router: Router;
  abstract protocol: string;
  protected clientToInput: Map<Client, EndpointInput<InputMeta, InputBody>> = new Map();
  abstract attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void;
  abstract sendToClient(client: Client, content: any): void;
  public didReceiveContent: (input: EndpointInput<InputMeta, InputBody>, client: Client) => void = () => { };
  protected onStart(): void { }
  protected onDispose(): void { }
}
