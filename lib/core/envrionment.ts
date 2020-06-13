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
  private app: Application | null = null;
  private isReady: boolean = false;
  private watingEvent: Function[] = [];

  private constructor() {
    this.server.adaptorsToConfigure.observeChange(updated => {
      if (this.isReady) {
        this.app?.onAdaptorAdded(updated.key);
      } else {
        this.watingEvent.push(() => {
          this.app?.onAdaptorAdded(updated.key);
        })
      }
    })
  }

  run(app: Application): void {
    if (!this.app) {
      this.app = app;
      this.server.start();
      app.onStartUp();
      app.configure(Injector.shard, this.server);
      this.isReady = true;
      this.watingEvent.forEach(t => t());
      this.watingEvent = [];
      Log.success("\nenlace is ready!!")
      Log.ask();
    } else {
      // todo log here
    }
  }

}
