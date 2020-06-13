import { HttpAdaptor } from "../lib/adaptor/http_adaptor/mod.ts";
import { ControllerMapping } from "../lib/decorators/controller.ts";
import { Endpint } from "../lib/decorators/endpoint.ts";
import { Application, EnlaceApplication } from "../lib/core/application.ts";
import { MainApplication } from "../lib/decorators/main_application.ts";
import { Adaptor, EnlaceServer } from "../lib/core/mod.ts";
import { EnlaceEnvironment } from "../lib/core/envrionment.ts";
import { AddAdaptor } from "../lib/decorators/add_adaptor.ts";
import { WebSocketAdaptor } from "../lib/adaptor/web_socket/adaptor.ts";
import { Injector } from "../lib/core/injector.ts";

@ControllerMapping({ expectedPath: '/cat', selectAdaptor: item => item instanceof HttpAdaptor })
class CatController {

  @Endpint({ expectedPath: '/all', selectAdaptor: item => item instanceof HttpAdaptor })
  all(): string {
    return "Hello World";
  }

}

@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor, { host: 'localhost', port: 20205 })
  onAddHttpAdaptor(adaptor: HttpAdaptor) {
    adaptor.router.useEndpointOn('/', new CatController());
  }

  @AddAdaptor(WebSocketAdaptor, { host: 'localhost', port: 20205 })
  onAddWebSocketAdaptor(adaptor: WebSocketAdaptor) {

  }

}