import { Injector } from "../injector/injector.ts";
import { EnlaceServer } from "../server.ts";
import { DEFAULT_APP_CONFIG } from "../../constant.ts";
import { Application } from "./application.ts";
import { ApplicationConfig } from "./application_config.ts";

// todo 重新设计
export class EnlaceApplication extends Application {

  public onStart: () => void = () => {
  };

  constructor(
    protected _configure: (injector: Injector, server: EnlaceServer) => void = () => {
    },
    public config: ApplicationConfig = DEFAULT_APP_CONFIG,
  ) {
    super(config);
  }

  onStartUp() {
    this.onStart();
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> {
    super.configure(injector, server);
    this._configure(injector, server);
  }

}
