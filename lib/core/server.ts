import { Adaptor, AdaptorConfigure } from "./adaptor.ts";
import { Endpoint, EndpointConfigure, FunctionalEndpoint, SmoothEndpoint, convertToEndpoint } from "./endpoint.ts";
import { EndpointInput } from "./endpoint.ts";
import { matchPath, parsePath } from "../util/match-path.ts";
import { Util } from "../util/mod.ts";
import { RootRouter, EndpointWithConfigure } from "./router.ts";

export class EnlaceServer {
  protected readonly adaptors: Map<Adaptor<any, any>, AdaptorConfigure>;
  protected readonly rootRouter: RootRouter = new RootRouter();

  constructor(adaptors: Map<Adaptor<any, any>, AdaptorConfigure> = new Map()) {
    this.adaptors = adaptors;
  }

  protected receiveContent(
    adaptor: Adaptor<any, any>,
    content: EndpointInput<any, any>,
  ): void {
    const path = content.path;
    let endpointWithConfigure: EndpointWithConfigure | null;
    const endpointWithConfigureInRoot = this.rootRouter.match(path);
    if (endpointWithConfigureInRoot && endpointWithConfigureInRoot.configure.selectAdaptor && endpointWithConfigureInRoot.configure.selectAdaptor(adaptor)) {
      endpointWithConfigure = endpointWithConfigureInRoot;
    } else {
      const endpointWithConfigureInAdaptor = adaptor.router.match(path);
      endpointWithConfigure = endpointWithConfigureInAdaptor;
    }

    let result: any = undefined;
    if (endpointWithConfigure) {
      content.pathParameters = Util.parsePath(
        path,
        endpointWithConfigure.configure.expectedPath,
      );
      result = endpointWithConfigure.endpoint.receive(content);
    }
    if (result) {
      adaptor.sendToClient(content, result);
    } else {
      // todo 404
    }
  }

  public addAdaptor(adaptor: Adaptor<any, any>, configure: AdaptorConfigure) {
    adaptor.attachOnServer(this, configure);
    adaptor.didReceiveContent = (content) => {
      this.receiveContent(adaptor, content);
    };
    this.adaptors.set(adaptor, configure);
  }

  public addEndpoint(
    endpoint: SmoothEndpoint,
    configure: EndpointConfigure,
  ) {
    this.rootRouter.useWithConfigure(configure, endpoint);
  }
}
