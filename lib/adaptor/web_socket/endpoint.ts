import { WebSocketEndpointInput } from "./endpoint_input.ts";
import { WebSocketAdaptor } from "./adaptor.ts";
import { KeepAliveEndpoint } from "../../keepalive_endpoint.ts";
import { Client } from "../../client.ts";

export abstract class WebSocketEndpoint extends KeepAliveEndpoint {

  abstract receive(input: WebSocketEndpointInput): void;
  
  public async sendMessageToClient(message: any, client: Client): Promise<void> {
    const adaptor = this.server.getAdaptor(WebSocketAdaptor);
    adaptor?.sendToClient(client, message)
  }

}