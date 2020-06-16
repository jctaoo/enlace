import { HttpAdaptor } from "../lib/adaptor/mod.ts";
import { Application } from "../lib/core/mod.ts";
import {
  MainApplication,
  AddAdaptor
} from "../lib/decorators/mod.ts";

@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(adaptor: HttpAdaptor) {
    adaptor.router.useEndpointOn('/', () => 'HelloWorld');
  }

}