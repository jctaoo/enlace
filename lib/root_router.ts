import { Router } from "./core/router.ts";
import { EndpointConfigure, UnkonwnEndpoint, convertUnkonwnEndpointToEndpoint } from "./core/endpoint.ts";
import { MiddleWareConfigure, MiddleWare } from "./core/middleware.ts";

/**
 * The Router used on EnlaceServer instance.
 */
export class RootRouter extends Router {

  /**
   * Register endpoint on the router with endpoint configure.
   * 
   * @param endpoint Endpoint to register.
   * @param configure Configure of endpoint to register. 
   */
  public useEndpointWithConfigure(endpoint: UnkonwnEndpoint, configure: EndpointConfigure) {
    this.addEndpointAndConfigure(convertUnkonwnEndpointToEndpoint(endpoint), configure);
  }

  /**
   * Register middle ware on the router with middle ware configure.
   * 
   * @param middleWare MiddleWare to register.
   * @param configure Configure of middle ware to register.
   */
  public useMiddleWareWithConfigure( middleWare: MiddleWare, configure: MiddleWareConfigure) {
    this.addMiddleWareAndConfigure(middleWare, configure);
  }
  
}

