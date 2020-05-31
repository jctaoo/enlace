import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor } from "../lib/adaptor/http-adaptor/http-adaptor.ts";
import HttpEndpoint from "../lib/adaptor/http-adaptor/http-endpoint.ts";
import { HttpEndpointInput } from "../lib/adaptor/http-adaptor/http-endpoint-input.ts";

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

server.addEndpoint(
  endpoint,
  { expectedPath: "/", selectAdaptor: (adaptors) => adaptors[0] },
);
