import { DEFAULT_APP_CONFIG } from "../../constant.ts";
import { Injector } from "../injector/injector.ts";
import { EnlaceServer } from "../server.ts";
import { ApplicationConfig } from "./application_config.ts";

export abstract class Application {

  protected constructor(
    public config: ApplicationConfig = DEFAULT_APP_CONFIG
  ) {
  }

  onStartUp(): void | Promise<void> {
    // todo pass
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> {
    // todo pass
  }

}