import { EnlaceServer } from "../lib/core/server.ts";
import { HttpAdaptor } from "../lib/adaptor/http_adaptor/mod.ts";
import { ControllerMapping } from "../lib/decorators/controller.ts";
import { Endpint } from "../lib/decorators/endpoint.ts";
import { Application } from "../lib/application.ts";
import { MainApplication } from "../lib/decorators/main_application.ts";

@ControllerMapping({ expectedPath: '/cat', selectAdaptor: item => item instanceof HttpAdaptor })
class CatController {

  @Endpint({ expectedPath: '/all', selectAdaptor: item => item instanceof HttpAdaptor })
  all(): string {
    return "Hello World";
  }

}

@MainApplication
class DemoApplication extends Application {

  onStartUp() {
    console.log('Hello World')
    
  }

}