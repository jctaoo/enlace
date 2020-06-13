import { HttpAdaptor } from "../lib/adaptor/http_adaptor/mod.ts";
import { ControllerMapping } from "../lib/decorators/controller.ts";
import { Endpint } from "../lib/decorators/endpoint.ts";
import { Application, EnlaceApplication } from "../lib/core/application.ts";
import { MainApplication } from "../lib/decorators/main_application.ts";
import { Adaptor } from "../lib/core/mod.ts";
import { EnlaceEnvironment } from "../lib/core/envrionment.ts";

@ControllerMapping({ expectedPath: '/cat', selectAdaptor: item => item instanceof HttpAdaptor })
class CatController {

  @Endpint({ expectedPath: '/all', selectAdaptor: item => item instanceof HttpAdaptor })
  all(): string {
    return "Hello World";
  }

}

@MainApplication
class DemoApplication extends Application {

  onAdaptorAdded(adaptor: Adaptor) {
    if (adaptor instanceof HttpAdaptor) {
      adaptor.router.useEndpointOn('/', new CatController());
    }
  }

}