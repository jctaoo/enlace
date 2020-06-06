import { Adaptor} from "./adaptor.ts";
import { Endpoint, EndpointConfigure, UnkonwnEndpoint, convertUnkonwnEndpointToEndpoint, EndpointWithConfigure } from "./endpoint.ts";
import { Util, Log, TrueFunction } from "../util/mod.ts";
import { rgb24 } from "https://deno.land/std/fmt/colors.ts";
import { MiddleWareConfigure, MiddleWare, MiddleWareWithConfigure } from "./middleware.ts";
import { EnlaceServer } from "./server.ts";

type RouterHolder = EnlaceServer | Adaptor;

/**
 * Function module that guides network requests to the correct Endpoint.
 */
export class Router {
  /**
   * The owner of the Router. It's might be an instance of EnlceServer 
   * or Adaptor.
   */
  public readonly holder: RouterHolder;

  constructor(holder: RouterHolder) {
    this.holder = holder;
  }

  /**
   * A boolean value indicates whether the router is on the EnlceServer 
   * instance.
   */
  public get isRootRouter(): boolean {
    return this.holder instanceof EnlaceServer;
  }

  /**
   * A map table store the relationship between endpoint configure and regisetered endpoint.
   */
  protected configureToEndpoint: Map<EndpointConfigure, Endpoint> = new Map();

  /**
   * A list value store the relationship between endpoint configure and registered middle ware.
   */
  protected middlewaresWithConfigure: Array<MiddleWareWithConfigure> = new Array();

  /**
   * A list value indicates all the registered endpoints in the Router.
   */
  public get endpoints(): Endpoint[] {
    return [...this.configureToEndpoint.values()];
  }

  /**
   * A list value indicates all the registered middlewares in the Router.
   */
  public get middlewares(): MiddleWare[] {
    return this.middlewaresWithConfigure.map(i => i.middleWare);
  }

  /**
   * Register the given middleware on the expected path.
   * 
   * @param path The expected path of the middleware. (@see EndpointConfigure.expectedPath)
   * @param middleWare The middleware to register.
   */
  public useMiddlewareOn(path: string, middleware: MiddleWare) {
    const configure: MiddleWareConfigure = {
      expectedPath: path
    }
    this.addMiddleWareAndConfigure(middleware, configure);
  }

  /**
   * Register the given endpoint on the expected path.
   * 
   * @param path The expected path of the endpoint. (@see EndpointConfigure.expectedPath)
   * @param endpoint The endpoint to register.
   */
  public useEndpointOn(path: string, endpoint: UnkonwnEndpoint) {
    const configure: EndpointConfigure = {
      expectedPath: path,
      selectAdaptor: TrueFunction,
    };
    this.addEndpointAndConfigure(convertUnkonwnEndpointToEndpoint(endpoint), configure);
  }

  /**
   * Match the given actual-path with all the expected-path in middlewares' 
   * configure to find out all the suitable middlewares to call.
   * 
   * @param path the actual-path
   */
  public matchMiddleWareWithPath(path: string): MiddleWareWithConfigure[] {
    let matched: MiddleWareWithConfigure[] = [];
    for (const {configure, middleWare} of this.middlewaresWithConfigure) {
      if (Util.matchPath(path, configure.expectedPath)) {
        matched.push({ configure, middleWare });
      }
    }
    return matched;
  }

  /**
   * Match the given actual-path with all the expected-path in endpoints' 
   * configure to find out the most suitable endpoint to call.
   * 
   * @param path the actual-path
   */
  public matchEndpointWithPath(path: string): EndpointWithConfigure | null {
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

  /**
   * General method for registering endpoints.
   * 
   * @param endpoint The endpoint to register.
   * @param configure The configure of endpoint to register.
   */
  protected addEndpointAndConfigure(endpoint: Endpoint, configure: EndpointConfigure) {
    Log.info(`register ${rgb24(configure.expectedPath, 0xffc42e)} on endpoint`, 'Router');
    this.configureToEndpoint.set(configure, endpoint);
    // set server on endpoint
    if (this.holder instanceof EnlaceServer) {
      endpoint.server = this.holder;
    } else {
      endpoint.server = this.holder.server;
    }
  }

  /**
   * General method for registering middlewares.
   * 
   * @param middleWare The middleware to register.
   * @param configure The configure of middleware to register.
   */
  protected addMiddleWareAndConfigure(middleware: MiddleWare, configure: MiddleWareConfigure) {
    Log.info(`register ${rgb24(configure.expectedPath, 0xffc42e)}`, 'Router');
    this.middlewaresWithConfigure.push({ configure, middleWare: middleware });
  }

}

