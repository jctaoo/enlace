import EndpointInput from "./endpoint-input.ts";
import { Adaptor } from "../adaptor/adaptor.ts";
import Client from "./client.ts";

export interface EndpointConfigure {
  expectedPath: string;
  selectAdaptor: (adaptors: Adaptor<any, any>[]) => Adaptor<any, any>;
}

export interface Endpoint {
  receive(input: EndpointInput<any, any>): any;
}

export type FunctionalEndpoint = (input: any) => any;

export abstract class NormalEndpoint<Meta> implements Endpoint {
  abstract receive(input: EndpointInput<Meta, any>): any;
}

export abstract class KeepAliveEndpoint<Meta> implements Endpoint {
  public clients: Client[] = [];

  abstract receive(input: EndpointInput<Meta, any>): void;
  abstract requesterDidOffline(): void;
  abstract requesterDidOnline(): void;

  public broadcast<Content>(
    message: Content,
    clients: Client[] = this.clients,
  ): void {
    for (const requester of clients) {
      this.sendMessage(message, requester);
    }
  }

  public sendMessage<Content>(message: Content, requester: Client): void {
    // todo
  }
}
