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
const endpoint = new SimpleEndpoint();

const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};

server.addEndpoint(
  endpoint,
  { expectedPath: "/", selectAdaptor: (adaptors) => adaptors[0] },
);
server.addEndpoint(
  FunctionEndpoint,
  { expectedPath: "/functional", selectAdaptor: (adaptors) => adaptors[0] },
);
