import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor } from "../lib/adaptor/http-adaptor/adaptor.ts";
import HttpEndpoint from "../lib/adaptor/http-adaptor/endpoint.ts";
import { HttpEndpointInput } from "../lib/adaptor/http-adaptor/endpoint-input.ts";
import { WebSocketEndpoint } from "../lib/adaptor/web_socket/endpoint.ts";
import { WebSocketEndpointInput } from "../lib/adaptor/web_socket/endpoint_input.ts";
import { WebSocketAdaptor } from "../lib/adaptor/web_socket/adaptor.ts";

const server = new EnlaceServer();
const httpAdaptor = new HttpAdaptor();
const wsAdaptor = new WebSocketAdaptor(httpAdaptor);
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });
server.addAdaptor(wsAdaptor, { host: "localhost", port: 20205 });

class SimpleEndpoint extends HttpEndpoint {
  async receive(input: HttpEndpointInput): Promise<string> {
    const json = await input.json();
    if (json && 'name' in json) {
      const profile = json as { name: string };
      return `Hello ${profile.name}`;
    } else {
      return `wrong request`;
    }
  }
}

const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};

class ChatEndpoint extends WebSocketEndpoint {
  receive(input: WebSocketEndpointInput): void {
    console.log(`ws: ${input.body}`);
    this.broadcast(`welcome ${input.body}`)
  }
}

httpAdaptor.router.use("/", SimpleEndpoint);
httpAdaptor.router.use("/functional", FunctionEndpoint);
wsAdaptor.router.use("/your-name", ChatEndpoint);
server.addEndpoint(FunctionEndpoint, { selectAdaptor: (e) => true, expectedPath: '/root-router' })