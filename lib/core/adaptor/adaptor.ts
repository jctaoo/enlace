import { EnlaceServer } from "../server.ts";
import { Router } from "../router.ts";
import { Client } from "../../client.ts";
import { GenericEndpointInput } from "../endpoint/endpoint_input.ts";
import { AdaptorConfig } from "./adaptor_config.ts";

export abstract class Adaptor {
  /**
   * This value is empty when the Adaptor is not added to EnlaceServer.
   */
  protected config!: AdaptorConfig;

  public get isAssociatedWithServer(): boolean {
    // todo
    return true;
  }

  /**
   * Router instance contained in the adapter.
   */
  public router: Router = new Router(this);

  /**
   * A string value indicates network protocol of this Adaptor. (like 'HTTP/1.1')
   */
  public static protocol: string = 'None';

  /**
   * A map table store the relationship between clients and their own input.
   * Subclasses need to maintain themselves.
   */
  protected clientToInput: Map<Client, GenericEndpointInput> = new Map();

  /**
   * The method to establish contact with EnlaceServer and start custom
   * network request monitoring behavior.
   *
   * Note: This method must be implemented by an adapter of a specific
   * network protocol even if it isn't an abstract method. Otherwise,
   * the adaptor cannot work as expected.
   *
   * @param server
   * @param config
   */
  attachOnServer(server: EnlaceServer, config: AdaptorConfig): void {
    this.config = config;
  }

  /**
   * Send any message to given client.
   * An abstract method implemented by an adapter of a specific network protocol.
   *
   * @param client the client to send message
   * @param content content of the message and it's always not a Promise
   */
  public abstract sendToClient(client: Client, content: unknown): void;

  /**
   * The callback function provided by EnlaceServer to notify the
   * EnlaceServer that a new request has arrived.The normal practice
   * is to call the callback function when the Adaptor receives a
   * network request.
   *
   * @param input package of the message from the client in the network request.
   * @param client where the network request from.
   */
  public didReceiveContent: (input: GenericEndpointInput, client: Client) => void = () => { };

  /**
   * Life cycle callback called when the adapter is already on the
   * server and starts listening for requests. Called by EnlaceServer.
   */
  protected onStart(): void { }

  /**
   * Life cycle callback called when the adapter has stopped listening
   * for requests or is no longer associated with any server. Called by
   * EnlaceServer.
   */
  protected onDispose(): void { }

}
