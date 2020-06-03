import { Adaptor } from "./adaptor.ts";
import { PathParameter } from "../util/match-path.ts";

export interface Client {
  ip: Deno.Addr;
  id: string;
}

export interface EndpointInput<Meta, Body> {
  protocol: string;
  client: Client;
  path: string;
  meta: Meta;
  parameters: { [key: string]: string };
  body?: Body;
  pathParameters: PathParameter;
  [propName: string]: any;
}

export interface EndpointConfigure {
  expectedPath: string;
  selectAdaptor?: (adaptors: Adaptor<any, any>) => boolean;
}

export type SmoothEndpoint = typeof ClassEndpoint | Endpoint | FunctionalEndpoint;
export const convertToEndpoint = (endpoint: SmoothEndpoint): Endpoint => {
  if (endpoint instanceof ClassEndpoint) {
    return endpoint;
  } else if ('receive' in endpoint) {
    return endpoint;
  } else if (typeof endpoint === 'function') {
    try {
      // todo 优化判断方式
      // @ts-ignore
      return new (endpoint as typeof ClassEndpoint)();
    } catch {
      return { receive: endpoint as FunctionalEndpoint };
    }
  }
  return endpoint;
}

export interface Endpoint {
  receive(input: EndpointInput<any, any>): any;
}
export type FunctionalEndpoint = (input: any) => any;
abstract class ClassEndpoint implements Endpoint {
  constructor() {}
  abstract receive(input: EndpointInput<any, any>): any;
}

export abstract class NormalEndpoint<Meta> extends ClassEndpoint {
  abstract receive(input: EndpointInput<Meta, any>): any;
}

export abstract class KeepAliveEndpoint<Meta> extends ClassEndpoint {
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
