import {
  AdaptorConfigure,
  Adaptor as ComplexAdaptor,
} from "./adaptor.ts";
import { EndpointConfigure, SmoothEndpoint, convertToEndpoint } from "./endpoint.ts";
import { Endpoint } from "./endpoint.ts";
import { Log } from "../util/mod.ts";
import { Util } from "../util/mod.ts";
import { green, yellow, rgb24 } from "https://deno.land/std/fmt/colors.ts";

type Adaptor = ComplexAdaptor<any, any>;
export type EndpointWithConfigure = {
  configure: EndpointConfigure;
  endpoint: Endpoint;
};

export class Router {
  protected configureToEndpoint: Map<EndpointConfigure, Endpoint> = new Map();

  public get endpoints(): Endpoint[] {
    return [...this.configureToEndpoint.values()];
  }

  protected addEndpointAndConfigure(endpoint: Endpoint, configure: EndpointConfigure) {
    // todo 打印出 adaptor 类型
    Log.info(`bind ${rgb24(configure.expectedPath, 0xffc42e)}`, 'Router')
    this.configureToEndpoint.set(configure, endpoint);
  }

  public use(path: string, endpoint: SmoothEndpoint) {
    const configure: EndpointConfigure = {
      expectedPath: path
    };
    this.addEndpointAndConfigure(convertToEndpoint(endpoint), configure);
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
}

