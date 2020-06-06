import { KeepAliveEndpoint, Client } from "../../core/endpoint.ts";
import { WebSocketMeta, WebSocketEndpointInput } from "./endpoint_input.ts";
import { WebSocketAdaptor } from "./adaptor.ts";

export abstract class WebSocketEndpoint extends KeepAliveEndpoint<WebSocketMeta> {
  abstract receive(input: WebSocketEndpointInput): void;
  public async sendMessage(message: any, client: Client): Promise<void> {
    const adaptor = this.server?.getAdaptor(WebSocketAdaptor);
    adaptor?.sendToClient(client, message)
  }
}