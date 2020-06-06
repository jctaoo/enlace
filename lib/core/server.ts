import { Adaptor, AdaptorConfigure } from "./adaptor.ts";
import { Endpoint, EndpointConfigure, FunctionalEndpoint, SmoothEndpoint, convertToEndpoint, Client } from "./endpoint.ts";
import { EndpointInput } from "./endpoint.ts";
import { matchPath, parsePath } from "../util/match-path.ts";
import { Util } from "../util/mod.ts";
import { RootRouter, EndpointWithConfigure } from "./router.ts";
import { MiddleWareWithConfigure, MiddleWare, MiddleWareConfigure } from "./middle_ware.ts";
import { HttpEndpointInput } from "../adaptor/http-adaptor/endpoint-input.ts";

export class EnlaceServer {
  protected readonly adaptors: Map<Adaptor<any, any>, AdaptorConfigure>;
  protected readonly rootRouter: RootRouter = new RootRouter(this);

  constructor(adaptors: Map<Adaptor<any, any>, AdaptorConfigure> = new Map()) {
    this.adaptors = adaptors;
  }

  public getAdaptor(type: any): Adaptor<any, any> | null {
    try {
      for (const adaptor of [...this.adaptors.keys()]) {
        if (adaptor instanceof type) {
          return adaptor;
        }
      }
      return null;
    } catch {
      // todo log here
      return null;
    }
  }

  protected async receiveContent(
    adaptor: Adaptor<any, any>,
    input: EndpointInput<any, any>,
    client: Client,
  ): Promise<void> {
    const path = input.path;
    const middleWaresWithConfigure = this.getMiddlesWareWithPathAndAdaptor(path, adaptor);
    const endpointWithConfigure = this.getEndpointWithPathAndAdaptor(path, adaptor);

    this.executeMiddleWaresWithInput(middleWaresWithConfigure.map(mw => mw.middleWare), input);
    if (endpointWithConfigure) {
      const result = await this.executeEndpointWithConfigureWithPathAndInput(endpointWithConfigure, path, input);
      if (result) {
        adaptor.sendToClient(client, result);
      } else {
        // todo 404
      }
    } else {
      // todo no matched endpoint
    }
  }

  protected async executeEndpointWithConfigureWithPathAndInput(
    endpointWithConfigure: EndpointWithConfigure,
    path: string,
    input: EndpointInput<any, any>
  ): Promise<any> {
    const pathParameters = Util.parsePath(path, endpointWithConfigure.configure.expectedPath);
    input.pathParameters = pathParameters;
    let result = endpointWithConfigure.endpoint.receive(input);
    if (result instanceof Promise) {
      result = await result;
    }
    return result;
  }

  protected executeMiddleWaresWithInput(middleWares: MiddleWare[], input: EndpointInput<any, any>) {
    if (middleWares.length > 0) {
      const first = middleWares[0];
      first(input, () => {
        this.executeMiddleWaresWithInput(middleWares.splice(1), input);
      });
    }
  }

  protected getMiddlesWareWithPathAndAdaptor(path: string, adaptor: Adaptor<any, any>): MiddleWareWithConfigure[] {
    return [
      ...this.rootRouter.matchMiddleWare(path),
      ...adaptor.router.matchMiddleWare(path),
    ];
  }

  protected getEndpointWithPathAndAdaptor(path: string, adaptor: Adaptor<any, any>): EndpointWithConfigure | null {
    let endpointWithConfigure: EndpointWithConfigure | null;
    const endpointWithConfigureInRoot = this.rootRouter.match(path);
    if (endpointWithConfigureInRoot && endpointWithConfigureInRoot.configure.selectAdaptor && endpointWithConfigureInRoot.configure.selectAdaptor(adaptor)) {
      endpointWithConfigure = endpointWithConfigureInRoot;
    } else {
      const endpointWithConfigureInAdaptor = adaptor.router.match(path);
      endpointWithConfigure = endpointWithConfigureInAdaptor;
    }
    return endpointWithConfigure;
  }

  public addAdaptor(adaptor: Adaptor<any, any>, configure: AdaptorConfigure) {
    adaptor.attachOnServer(this, configure);
    adaptor.didReceiveContent = (content, client) => {
      this.receiveContent(adaptor, content, client).then();
    };
    this.adaptors.set(adaptor, configure);
    adaptor.server = this;
  }

  public addEndpoint(endpoint: SmoothEndpoint, configure: EndpointConfigure) {
    this.rootRouter.useWithConfigure(configure, endpoint);
  }

  public addMiddleWare(middWare: MiddleWare, configure: MiddleWareConfigure) {
    this.rootRouter.useMiddleWareWithConfigure(configure, middWare);
  }
}
