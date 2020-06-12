import { Application } from "../application.ts";
import { Injector } from "./injector.ts";
import { EnlaceServer } from "./server.ts";

export class EnlaceEnvironment {

  public static shard = new EnlaceEnvironment();
  private constructor() { }
  private server = new EnlaceServer();

  run(app: Application): void {
    this.server.start();
    app.onStartUp();
    app.configure(Injector.shard, this.server);
  }

}