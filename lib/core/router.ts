import {
  Endpoint,
  EndpointConfig,
  GenericEndpoint,
  toEndpoint,
  EndpointWithConfigure
} from "./endpoint/mod.ts";
import { Util, Log, TrueFunction } from "../util/mod.ts";
import { rgb24 } from "https://deno.land/std/fmt/colors.ts";
import { MiddlewareConfig, Middleware, MiddleWareWithConfigure } from "./middleware/mod.ts";
import { EnlaceServer } from "./server.ts";
import { isController, getEndpointsInController } from "../controller.ts";
import { Adaptor } from "./adaptor/mod.ts";

type RouterHolder = EnlaceServer | Adaptor;
type RouteItem = GenericEndpoint | Object;

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
  protected configureToEndpoint: Map<EndpointConfig, Endpoint> = new Map();

  /**
   * A list value store the relationship between endpoint configure and registered middle ware.
   */
  protected middlewareWithConfigure: Array<MiddleWareWithConfigure> = new Array();

  /**
   * A list value indicates all the registered endpoints in the Router.
   */
  public get endpoints(): Endpoint[] {
    return [...this.configureToEndpoint.values()];
  }

  /**
   * A list value indicates all the registered middlewares in the Router.
   */
  public get middleware(): Middleware[] {
    return this.middlewareWithConfigure.map(i => i.middleWare);
  }

  /**
   * Register the given middleware on the expected path.
   *
   * @param path The expected path of the middleware. (@see EndpointConfigure.expectedPath)
   * @param middleWare The middleware to register.
   */
  public useMiddlewareOn(path: string, middleware: Middleware) {
    const configure: MiddlewareConfig = {
      expectedPath: path
    }
    this.addMiddleWareAndConfigure(middleware, configure);
  }

  /**
   * Register the given endpoint on the expected path.
   * @see Router.useEndpoint
   *
   * @param path The expected path of the endpoint. (@see EndpointConfigure.expectedPath)
   * @param endpoint The endpoint to register.
   */
  public useEndpointOn(path: string, endpoint: RouteItem): Router {
    return this.useEndpoint(endpoint, {expectedPath: path, selectAdaptor: TrueFunction});
  }

  /**
   * The general method to register a endpoint or a controller on the router.
   * If the endpoint parameter is passed into a controller, all configure of
   * endpoints in the controller will in inherit the configure parameter.
   * Otherwise, the configure parameter must be passed into.
   *
   * @param endpoint The endpoint to register.
   * @param configure The configure of endpint.
   */
  public useEndpoint(endpoint: RouteItem, configure?: EndpointConfig): Router {
    if (isController(endpoint)) {
      const endpoints = getEndpointsInController(endpoint);
      for (const {endpoint, configure} of endpoints) {
        this.addEndpointWithConfigure(toEndpoint(endpoint), configure);
      }
    } else {
      // todo waraing if the configure is not be passed into.
      this.addEndpointWithConfigure(toEndpoint(endpoint as GenericEndpoint), configure!);
    }
    return this;
  }

  /**
   * Match the given actual-path with all the expected-path in middlewares'
   * configure to find out all the suitable middlewares to call.
   *
   * @param path the actual-path
   */
  public matchMiddleWareWithPath(path: string): MiddleWareWithConfigure[] {
    let matched: MiddleWareWithConfigure[] = [];
    for (const {configure, middleWare} of this.middlewareWithConfigure) {
      if (Util.matchPath(path, configure.expectedPath)) {
        matched.push({configure, middleWare});
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
          matched = {configure, endpoint};
        }
      }
    }
    return matched;
  }

  /**
   * General method for registering endpoints.
   *
   * @param endpoint The endpoint to register.
   * @param config The config of endpoint to register.
   */
  protected addEndpointWithConfigure(endpoint: Endpoint, config: EndpointConfig) {
    Log.info(`register ${rgb24(config.expectedPath, 0xffc42e)} on endpoint`, 'Router');
    this.configureToEndpoint.set(config, endpoint);
  }

  /**
   * General method for registering middleware.
   *
   * @param middleware The middleware to register.
   * @param configure The configure of middleware to register.
   */
  protected addMiddleWareAndConfigure(middleware: Middleware, configure: MiddlewareConfig) {
    this.middlewareWithConfigure.push({configure, middleWare: middleware});
  }

}

