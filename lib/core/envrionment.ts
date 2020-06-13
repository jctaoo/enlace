import { Application } from "./application.ts";
import { Injector } from "./injector.ts";
import { EnlaceServer } from "./server.ts";
import { Adaptor } from "./adaptor.ts";
import { AdaptorConfigure } from "./adaptor.ts";

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
      this.getInput();
    } else {
      // todo log here
    }
  }

  private async getInput() {
    await Deno.stdout.write(new TextEncoder().encode('> '));
    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    const input = new TextDecoder().decode(buf.subarray(0, n));
    eval(input);
    this.getInput();
  }

}