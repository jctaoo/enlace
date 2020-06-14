import { HttpAdaptor } from "../lib/adaptor/http_adaptor/mod.ts";
import { Application, EnlaceApplication } from "../lib/core/application.ts";
import { MainApplication } from "../lib/decorators/main_application.ts";
import { AddAdaptor } from "../lib/decorators/add_adaptor.ts";

@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(adaptor: HttpAdaptor) {
    adaptor.router.useEndpointOn('/', () => 'HelloWorld');
  }

}