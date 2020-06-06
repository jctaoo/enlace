import {
  AdaptorConfigure,
  Adaptor as ComplexAdaptor,
} from "./adaptor.ts";
import { EndpointConfigure, SmoothEndpoint, convertToEndpoint, EndpointInput } from "./endpoint.ts";
import { Endpoint } from "./endpoint.ts";
import { Log } from "../util/mod.ts";
import { Util } from "../util/mod.ts";
import { green, yellow, rgb24 } from "https://deno.land/std/fmt/colors.ts";
import { MiddleWareConfigure, MiddleWare, MiddleWareWithConfigure } from "./middle_ware.ts";
import { EnlaceServer } from "./server.ts";
import { WebSocketEndpoint } from "../adaptor/web_socket/endpoint.ts";

type Adaptor = ComplexAdaptor<any, any>;
type RouterHolder = EnlaceServer | Adaptor;
export type EndpointWithConfigure = {
  configure: EndpointConfigure;
  endpoint: Endpoint;
};

export class Router {
  constructor(
    public readonly holder: RouterHolder
  ) {}

  public get isRootRouter(): boolean {
    return this.holder instanceof EnlaceServer;
  }

  protected configureToEndpoint: Map<EndpointConfigure, Endpoint> = new Map();
  protected configureToMiddleWare: Map<MiddleWareConfigure, MiddleWare> = new Map();

  public get endpoints(): Endpoint[] {
    return [...this.configureToEndpoint.values()];
  }

  protected addEndpointAndConfigure(endpoint: Endpoint, configure: EndpointConfigure) {
    // todo 打印出 adaptor 类型
    Log.info(`bind ${rgb24(configure.expectedPath, 0xffc42e)}`, 'Router')
    this.configureToEndpoint.set(configure, endpoint);
    if (this.holder instanceof EnlaceServer) {
      endpoint.server = this.holder;
    } else {
      endpoint.server = this.holder.server;
    }
  }

  protected addMiddleWareAndConfigure(middleWare: MiddleWare, configure: MiddleWareConfigure) {
    // todo log here
    this.configureToMiddleWare.set(configure, middleWare);
  }

  public useMiddleWare(path: string, middleWare: MiddleWare) {
    const configure: MiddleWareConfigure = {
      expectedPath: path
    }
    this.addMiddleWareAndConfigure(middleWare, configure);
  }

  public use(path: string, endpoint: SmoothEndpoint) {
    const configure: EndpointConfigure = {
      expectedPath: path
    };
    this.addEndpointAndConfigure(convertToEndpoint(endpoint), configure);
  }

  public matchMiddleWare(path: string): MiddleWareWithConfigure[] {
    let matched: MiddleWareWithConfigure[] = [];
    for (const [configure, middleWare] of this.configureToMiddleWare) {
      if (Util.matchPath(path, configure.expectedPath)) {
        matched.push({ configure, middleWare });
      }
    }
    return matched;
  }

  public match(path: string): EndpointWithConfigure | null {
    let matched: EndpointWithConfigure | null = null;
    for (const [configure, endpoint] of this.configureToEndpoint) {
      if (Util.matchPath(path, configure.expectedPath)) {
        if (
          configure.expectedPath.length >
          (matched?.configure.expectedPath.length ?? 0)
        ) {
          matched = { configure, endpoint };
        }
      }
    }
    return matched;
  }
}

export class RootRouter extends Router {
  public useWithConfigure(configure: EndpointConfigure, endpoint: SmoothEndpoint) {
    this.addEndpointAndConfigure(convertToEndpoint(endpoint), configure);
  }

  public useMiddleWareWithConfigure(configure: MiddleWareConfigure, middleWare: MiddleWare) {
    this.addMiddleWareAndConfigure(middleWare, configure);
  }
}

