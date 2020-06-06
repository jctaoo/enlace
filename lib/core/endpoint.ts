import { Adaptor } from "./adaptor.ts";
import { PathParameter } from "../util/match-path.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";
import { MiddleWare } from "./middle_ware.ts";
import { EnlaceServer } from "./server.ts";

export class Client {
  constructor(
    public readonly ip: Deno.Addr,
    public readonly id: string
  ) {}
  static generate(ip: Deno.Addr): Client {
    const id = v4.generate();
    return new Client(ip, id);
  }
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
  selectAdaptor?: (adaptor: Adaptor<any, any>) => boolean;
}

export type SmoothEndpoint = typeof ClassEndpoint | Endpoint | FunctionalEndpoint;
export const convertToEndpoint = (endpoint: SmoothEndpoint): Endpoint => {
  if (endpoint instanceof ClassEndpoint) {
    return endpoint;
  } else if ('receive' in endpoint && 'server' in endpoint) {
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
  server?: EnlaceServer;
  receive(input: EndpointInput<any, any>): any | Promise<any>;
}
export type FunctionalEndpoint = (input: any) => any | Promise<any>;
abstract class ClassEndpoint implements Endpoint {
  constructor() {}
  server?: EnlaceServer;
  abstract receive(input: EndpointInput<any, any>): any | Promise<any>;
}

export abstract class NormalEndpoint<Meta> extends ClassEndpoint {
  abstract receive(input: EndpointInput<Meta, any>): any | Promise<any>;
}

export abstract class KeepAliveEndpoint<Meta> extends ClassEndpoint {
  public clients: Client[] = [];

  abstract receive(input: EndpointInput<Meta, any>): void;
  requesterDidOffline(): void {};
  requesterDidOnline(): void {};

  public broadcast<Content>(
    message: Content,
    clients: Client[] = this.clients,
  ): void {
    for (const requester of clients) {
      this.sendMessage(message, requester);
    }
  }

  public abstract async sendMessage(message: any, requester: Client): Promise<void>;
}
