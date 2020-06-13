import { Injector } from "./injector.ts";
import { Adaptor, EnlaceServer } from "./mod.ts";
import { HttpAdaptor } from "../adaptor/http_adaptor/mod.ts";
import { WebSocketAdaptor } from "../adaptor/web_socket/mod.ts";
import { int } from "../util/mod.ts";
import { AdaptorConfigure } from "./adaptor.ts";

export interface EnlaceApplicationConfigure {
  host?: string
  port: int
  scan: boolean
}
export const defaultEnlaceApplicationConfigure = {
  host: 'localhost',
  port: 20203,
  scan: false,
}

export function isEnlaceApplicationConfigure(obj: any): boolean {
  return typeof obj === 'object' && 'port' in obj && 'scan' in obj;
}

function convertEnlaceApplicationConfigureToAdaptorConfigure(configure: EnlaceApplicationConfigure): AdaptorConfigure {
  const res = { ...configure };
  if (!res.host) {
    res.host = "localhost";
  }
  return { host: res.host!, port: res.port };
}

export abstract class Application {

  constructor(
    public appConfig: EnlaceApplicationConfigure = defaultEnlaceApplicationConfigure
  ) { }

  onStartUp(): void | Promise<void> {
    // todo pass
  }

  configure(_injector: Injector, server: EnlaceServer): void | Promise<void> {
    const http = new HttpAdaptor();
    const ws = new WebSocketAdaptor(http);
    server.addAdaptorWithConfigure(http, convertEnlaceApplicationConfigureToAdaptorConfigure(this.appConfig));
    server.addAdaptorWithConfigure(ws, convertEnlaceApplicationConfigureToAdaptorConfigure(this.appConfig));
  }

  onAdaptorAdded(adaptor: Adaptor): void {
    // todo pass
  }

}

export class EnlaceApplication extends Application {

  public onStart: () => void = () => { };

  constructor(
    protected _configure: (injector: Injector, server: EnlaceServer) => void = () => { },
    public appConfig: EnlaceApplicationConfigure = defaultEnlaceApplicationConfigure,
  ) {
    super(appConfig);
  }

  onStartUp() {
    this.onStart();
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> {
    super.configure(injector, server);
    this._configure(injector, server);
  }

}
