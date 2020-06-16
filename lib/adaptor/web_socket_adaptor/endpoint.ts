import { WebSocketEndpointInput } from "./endpoint_input.ts";
import { WebSocketAdaptor } from "./adaptor.ts";
import { KeepAliveEndpoint } from "../../keepalive_endpoint.ts";
import { Client } from "../../client.ts";
import { useServer } from "../../decorators/use_server.ts";
import { Injector } from "../../core/injector/injector.ts";
import { HttpAdaptor } from "../http_adaptor/adaptor.ts";
import { useAdaptor } from "../../decorators/use_adaptor.ts";

export abstract class WebSocketEndpoint extends KeepAliveEndpoint {

  abstract receive(input: WebSocketEndpointInput): void;
  
  public async sendMessageToClient(message: any, client: Client): Promise<void> {
    const server = useServer();
    const adaptor = useAdaptor(HttpAdaptor);
    adaptor?.sendToClient(client, message)
  }

}