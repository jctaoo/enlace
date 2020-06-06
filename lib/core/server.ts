import { Adaptor, AdaptorConfigure } from "./adaptor.ts";
import { EndpointConfigure, UnkonwnEndpoint, EndpointWithConfigure } from "./endpoint.ts";
import { Util } from "../util/mod.ts";
import { MiddleWareWithConfigure, MiddleWare, MiddleWareConfigure } from "./middleware.ts";
import { RootRouter } from "../root_router.ts";
import { UnknownEndpointInput } from "../endpoint_input.ts";
import { Client } from "../client.ts";

export class EnlaceServer {
  /**
   * A map table store the relationship between adaptors and thier own configure.
   */
  protected readonly adaptorsToConfigure: Map<Adaptor, AdaptorConfigure> = new Map();

  /**
   * Router instance contained in the EnlaceServer.
   */
  protected readonly rootRouter: RootRouter = new RootRouter(this);

  /**
   * A list value indicates all the adaptors in the EnlaceServer.
   */
  protected get adaptors(): Adaptor[] {
    return [...this.adaptorsToConfigure.keys()];
  }

  /**
   * Register the given adaptor and it's own configure in the EnlaceServer.
   * 
   * @param adaptor The adaptor to register.
   * @param configure The configure of the adaptor to register.
   */
  public addAdaptorWithConfigure(adaptor: Adaptor, configure: AdaptorConfigure) {
    adaptor.attachOnServer(this, configure);
    adaptor.didReceiveContent = (content, client) => {
      this.receiveContent(adaptor, content, client).then();
    };
    this.adaptorsToConfigure.set(adaptor, configure);
  }
  
  /**
   * Register the given endpoint and it's own configure in the EnlaceServer.
   * 
   * @param adaptor The endpoint to register.
   * @param configure The configure of the endpoint to register.
   */
  public addEndpointWithConfigure(endpoint: UnkonwnEndpoint, configure: EndpointConfigure) {
    this.rootRouter.useEndpointWithConfigure(endpoint, configure);
  }

  /**
   * Register the given middware and it's own configure in the EnlaceServer.
   * 
   * @param adaptor The middware to register.
   * @param configure The configure of the middware to register.
   */
  public addMiddleWareWithConfigure(middware: MiddleWare, configure: MiddleWareConfigure) {
    this.rootRouter.useMiddleWareWithConfigure(middware, configure);
  }
  
  /**
   * Find the instance of adapor whitch is registered by type of adaptor. 
   * 
   * // todo dont use any !!! 
   * @param type The type of adaptor to find.
   */
  public getAdaptor(type: any): Adaptor | null {
    try {
      for (const adaptor of this.adaptors) {
        if (adaptor instanceof type) {
          return adaptor;
        }
      }
      return null;
    } catch {
      // todo throw custom error
      return null;
    }
  }

  /**
   * The callback function called by self when notified by a registered 
   * adapter. @see Adaptor.didReceiveContent
   * 
   * @param adaptor The adapter that notified the EnlaceServer.
   * @param input The package of the message from the client in the network 
   *              request provided by the given adaptor.
   * @param client Used to mark unique network requests. Provided by the given
   *               adaptor.
   */
  protected async receiveContent(adaptor: Adaptor, input: UnknownEndpointInput, client: Client): Promise<void> {
    const path = input.path;
    const middleWaresWithConfigure = this.getMiddlewaresWithPathAndAdaptor(path, adaptor);
    const endpointWithConfigure = this.getEndpointWithPathAndAdaptor(path, adaptor);

    this.executeMiddleWaresWithInput(middleWaresWithConfigure.map(mw => mw.middleWare), input);
    if (endpointWithConfigure) {
      const result = await this.executeEndpointWithConfigure(endpointWithConfigure, path, input);
      if (result) {
        adaptor.sendToClient(client, result);
      } else {
        // todo 404
      }
    } else {
      // todo no matched endpoint
    }
  }

  /**
   * Find all the suitable middlewares in the EnlaceServer and given adaptor. 
   * 
   * @param path the actual-path
   * @param adaptor The adaptor to find middlewares in it. 
   */
  protected getMiddlewaresWithPathAndAdaptor(path: string, adaptor: Adaptor): MiddleWareWithConfigure[] {
    return [
      ...this.rootRouter.matchMiddleWareWithPath(path),
      ...adaptor.router.matchMiddleWareWithPath(path),
    ];
  }

  /**
   * Find all the suitable enpdoints in the EnlaceServer and given adaptor. 
   * 
   * @param path the actual-path
   * @param adaptor The adaptor to find endpoints in it. 
   */
  protected getEndpointWithPathAndAdaptor(path: string, adaptor: Adaptor): EndpointWithConfigure | null {
    let endpointWithConfigure: EndpointWithConfigure | null;
    // match in EnalceServer
    const endpointWithConfigureInRoot = this.rootRouter.matchEndpointWithPath(path);
    if (endpointWithConfigureInRoot && endpointWithConfigureInRoot.configure.selectAdaptor(adaptor)) {
      endpointWithConfigure = endpointWithConfigureInRoot;
    } else {
      // match in given adaptor
      const endpointWithConfigureInAdaptor = adaptor.router.matchEndpointWithPath(path);
      endpointWithConfigure = endpointWithConfigureInAdaptor;
    }
    return endpointWithConfigure;
  }

  /**
   * Execute the given endpoint and return it's result. If the result of 
   * given endpoint's execution is a Promise, this method will unwrap it.
   * 
   * @param endpointWithConfigure The endpoint to execute and it's own configure.
   * @param path the actual-path
   * @param input The package of the message from the client in the network request.
   *              Will be passed into the given endpoint.
   * @returns The result of given endpoint's execution.
   */
  protected async executeEndpointWithConfigure(endpointWithConfigure: EndpointWithConfigure, path: string, input: UnknownEndpointInput): Promise<any> {
    const pathParameters = Util.parsePath(path, endpointWithConfigure.configure.expectedPath);
    input.pathParameters = pathParameters;
    let result = endpointWithConfigure.endpoint.receive(input);
    if (result instanceof Promise) {
      result = await result;
    }
    return result;
  }

  /**
   * Use recursion to execute all the given middleware in turn.
   * 
   * @param middlewares The list value indicates all the middlewares to execute.
   * @param input The package of the message from the client in the network request. Will be 
   *              passed into each given middlewares.
   */
  protected executeMiddleWaresWithInput(middlewares: MiddleWare[], input: UnknownEndpointInput) {
    if (middlewares.length > 0) {
      const first = middlewares[0];
      first(input, () => {
        this.executeMiddleWaresWithInput(middlewares.splice(1), input);
      });
    }
  }

}
