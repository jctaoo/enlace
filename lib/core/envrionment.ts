import { Application } from "./application.ts";
import { Injector } from "./injector.ts";
import { EnlaceServer } from "./server.ts";
import { Adaptor } from "./adaptor.ts";
import { AdaptorConfigure } from "./adaptor.ts";
import Log from "../util/log.ts";
import { signal, onSignal } from "https://deno.land/std/signal/mod.ts";

export class EnlaceEnvironment {

  public static shard = new EnlaceEnvironment();
  private server = new EnlaceServer();
  private app!: Application;
  private isReady: boolean = false;

  private constructor() {
    this.server.adaptorsToConfigure.observeChange(updated => {
      if (this.isReady) {
        this.app?.onAdaptorAdded(updated.key);
      }
    })
  }

  private initApp(app: Application) {
    if (!this.app) {
      this.app = app;
    } else {
      // todo log here
    }
  }

  async scan(): Promise<void> {
    // todo 
  }

  async run(app: Application): Promise<void> {
    this.initApp(app);

    if (this.app.appConfig.scan) {
      await this.scan();
    }
    this.app.configure(Injector.shard, this.server);
    this.server.start();
    this.isReady = true;
    for (const [key] of this.server.adaptorsToConfigure) {
      this.app.onAdaptorAdded(key);
    }
    this.app.onStartUp();
    Log.success("\nenlace is ready!!")
    Log.ask();
  }

}
