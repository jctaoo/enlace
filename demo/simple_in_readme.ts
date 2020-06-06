import { HttpEndpointInput } from "../lib/adaptor/http-adaptor/endpoint-input.ts";
import { HttpAdaptor } from "../lib/adaptor/http-adaptor/adaptor.ts";
import { EnlaceServer } from "../lib/core/server.ts";

const HelloEndpoint = (input: HttpEndpointInput): string => {
  return `Hello World`;
};

const httpAdaptor = new HttpAdaptor();
httpAdaptor.router.useEndpointOn("/", HelloEndpoint);

const server = new EnlaceServer();
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });