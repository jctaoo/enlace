import { Injector } from "./injector.ts";
import { EnlaceServer } from "./mod.ts";
import { DEFAULT_APP_CONFIG } from "../constant.ts";

export interface EnlaceApplicationConfigure {
  scan: boolean
}

export function isEnlaceApplicationConfigure(obj: any): boolean {
  return typeof obj === 'object' && 'scan' in obj;
}

export abstract class Application {

  constructor(
    public appConfig: EnlaceApplicationConfigure = DEFAULT_APP_CONFIG
  ) {
  }

  onStartUp(): void | Promise<void> {
    // todo pass
  }

  configure(injector: Injector, server: EnlaceServer): void | Promise<void> {
    // todo pass
  }

}

// todo 重新设计
export class EnlaceApplication extends Application {

  public onStart: () => void = () => {
  };

  constructor(
    protected _configure: (injector: Injector, server: EnlaceServer) => void = () => {
    },
    public appConfig: EnlaceApplicationConfigure = DEFAULT_APP_CONFIG,
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
