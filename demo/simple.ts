import { HttpAdaptor } from "../lib/adaptor/mod.ts";
import { Application, Router } from "../lib/core/mod.ts";
import {
  MainApplication,
  AddAdaptor
} from "../lib/decorators/mod.ts";

@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(router: Router) {
    router.useEndpointOn('/', () => 'HelloWorld');
  }

}