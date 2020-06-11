import { HttpAdaptor } from "../lib/adaptor/http_adaptor/adaptor.ts";
import { EnlaceServer } from "../lib/core/server.ts";

const HelloEndpoint = (): string => {
  return `Hello World`;
};

const httpAdaptor = new HttpAdaptor();
httpAdaptor.router.useEndpointOn("/", HelloEndpoint);

const server = new EnlaceServer();
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });