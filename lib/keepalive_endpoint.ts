import { ClassEndpoint } from "./core/mod.ts";
import { GenericEndpointInput } from "./core/endpoint/endpoint_input.ts";
import { Client } from "./client.ts";

export abstract class KeepAliveEndpoint extends ClassEndpoint {

  /**
   * A list value indicates all the clients connected with this endpoint.
   */
  public clients: Client[] = [];

  /**
   * @see Endpoint.recieve
   */
  abstract receive(input: GenericEndpointInput): void;

  // todo lifecycle callback
  // requesterDidOffline(): void {};
  // requesterDidOnline(): void {};

  /**
   * Send a message to a given two or more clients connected with this endpoint.
   * 
   * @param message The message to send to clients.
   * @param clients The list value indicates destinations of the message.
   */
  public broadcast(message: unknown, clients: Client[] = this.clients): void {
    for (const requester of clients) {
      this.sendMessageToClient(message, requester);
    }
  }

  /**
   * Send message to given client connected with this endpoint.
   * 
   * Note: Because of the limit of typescript, we cannot use generics 
   * to implement sendMessageToClient method. you can use with similar 
   * code to implement sendMessageToClient method:
   * 
   *  ```
   *      const adaptor = this.server.getAdaptor(AdaptorType);
   *      adaptor?.sendToClient(client, message);
   *  ```
   * 
   * @param message The message to send to the client.
   * @param client The destination of the message.
   */
  public abstract sendMessageToClient(message: unknown, client: Client): void

    
}