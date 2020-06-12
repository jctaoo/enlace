import { Injector } from "./core/injector.ts";
import { Adaptor, EnlaceServer } from "./core/mod.ts";
import { HttpAdaptor } from "./adaptor/http_adaptor/mod.ts";
import { WebSocketAdaptor } from "./adaptor/web_socket/mod.ts";
import { int } from "./util/mod.ts";

export interface EnlaceApplicationConfigure {
  host: string
  port: int
}

export abstract class Application {

  onStartUp(): void | Promise<void> { 
    // todo pass
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> { 
    // todo pass
  }

  onAdaptorAdded(adaptor: Adaptor): void {
    // todo pass
  }

}

export class EnlaceApplication extends Application {

  public onStart: () => void = () => {};

  constructor(
    private _configure: (injector: Injector, server: EnlaceServer) => void = () => {},
    private appConfig: EnlaceApplicationConfigure = { host: '0.0.0.0', port: 20203 },
  ) { 
    super();
  }

  onStartUp() {
    this.onStart();
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> { 
    super.configure(injector, server);
    const http = new HttpAdaptor();
    const ws = new WebSocketAdaptor(http);
    server.addAdaptorWithConfigure(http, this.appConfig);
    server.addAdaptorWithConfigure(ws, this.appConfig);
    this._configure(injector, server);
  }

}