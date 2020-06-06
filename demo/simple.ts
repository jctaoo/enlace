import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor, HttpEndpoint, HttpEndpointInput } from "../lib/adaptor/http_adaptor/mod.ts";
import { WebSocketEndpoint, WebSocketEndpointInput, WebSocketAdaptor } from "../lib/adaptor/web_socket/mod.ts";

const server = new EnlaceServer();
const httpAdaptor = new HttpAdaptor();
const wsAdaptor = new WebSocketAdaptor(httpAdaptor);
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });
server.addAdaptorWithConfigure(wsAdaptor, { host: "localhost", port: 20205 });

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

httpAdaptor.router.useEndpointOn("/", SimpleEndpoint);
httpAdaptor.router.useEndpointOn("/functional", FunctionEndpoint);
wsAdaptor.router.useEndpointOn("/your-name", ChatEndpoint);
server.addEndpointWithConfigure(FunctionEndpoint, { selectAdaptor: (e) => true, expectedPath: '/root-router' })