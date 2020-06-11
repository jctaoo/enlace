import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor, HttpEndpointInput } from "../lib/adaptor/http_adaptor/mod.ts";
import { ControllerMapping } from "../lib/decorators/controller.ts";
import { Endpint } from "../lib/decorators/endpoint.ts";

const server = new EnlaceServer();
const httpAdaptor = new HttpAdaptor();
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });

@ControllerMapping({ expectedPath: '/cat', selectAdaptor: item => item instanceof HttpAdaptor })
class CatController {

  @Endpint({ expectedPath: '/all', selectAdaptor: item => item instanceof HttpAdaptor })
  all(): string[] {
    return ['bob', 'ben'];
  }

}

const HelloEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};

httpAdaptor.router
  .useEndpointOn("/", HelloEndpoint)
  .useEndpoint(new CatController());