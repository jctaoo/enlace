import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor } from "../lib/adaptor/http-adaptor/adaptor.ts";
import HttpEndpoint from "../lib/adaptor/http-adaptor/endpoint.ts";
import { HttpEndpointInput } from "../lib/adaptor/http-adaptor/endpoint-input.ts";

const server = new EnlaceServer();
const httpAdaptor = new HttpAdaptor();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });

class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}

const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};

httpAdaptor.router.use("/", SimpleEndpoint);
httpAdaptor.router.use("/functional", FunctionEndpoint);
server.addEndpoint(FunctionEndpoint, { selectAdaptor: (e) => true, expectedPath: '/root-router' })