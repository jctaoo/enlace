import { Application } from "../application.ts";
import { Injector } from "./injector.ts";
import { EnlaceServer } from "./server.ts";
import { Adaptor } from "./adaptor.ts";
import { AdaptorConfigure } from "./adaptor.ts";

export class EnlaceEnvironment {

  public static shard = new EnlaceEnvironment();
  private server = new EnlaceServer();
  private app: Application | null = null;

  private constructor() {
    this.server.adaptorsToConfigure.observeChange(updated => {
      this.app?.onAdaptorAdded(updated.key);
    })
  }

  run(app: Application): void {
    console.clear();
    if (!this.app) {
      this.app = app;
      this.server.start();
      app.onStartUp();
      app.configure(Injector.shard, this.server);
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