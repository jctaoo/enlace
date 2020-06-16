import { Injector } from "./injector/injector.ts";
import { EnlaceServer } from "./server.ts";
import Log from "../util/log.ts";
import { getEventsMarkInApplication } from "../decorators/main_application.ts";
import ApplicationEvents from "../application_events.ts";
import { AddAdaptorApplicationEventMark } from "../decorators/add_adaptor.ts";
import { LOGO, PROJECT_NAME, WELCOME_WORDS } from "../constant.ts";
import { Application } from "./application/application.ts";
import { Adaptor } from "./adaptor/adaptor.ts";

export class Environment {

  // todo better way
  public ApplicationKey = Symbol("ApplicationKey");

  public static shard = new Environment();
  public server: EnlaceServer = this.registerServer();
  private app!: Application;
  private isReady: boolean = false;
  private adaptorToObserver: Map<Adaptor, Function> = new Map();

  private initApp(app: Application) {
    if (!this.app) {
      Log.clear();
      Log.success(WELCOME_WORDS, PROJECT_NAME);
      Log.info(LOGO);
      this.app = this.registerApplication(app);
      this.setEventsInAdaptor()
      // observe adaptors in server
      this.server.adaptorsToConfigure.observeChange(updated => {
        if (this.isReady) {
          this.callAdaptorObserver(updated.key)
        }
      })
    } else {
      // todo log here
    }
  }

  async scan(): Promise<void> {
    // todo 
  }

  async run(app: Application): Promise<void> {
    this.initApp(app);

    if (this.app.config.scan) {
      await this.scan();
    }
    this.app.configure(Injector.shard, this.server);
    this.server.start();
    this.isReady = true;
    for (const [key] of this.server.adaptorsToConfigure) {
      this.callAdaptorObserver(key);
    }
    Log.success("\nenlace is ready!!\n");
    this.app.onStartUp();
    Log.ask().then();
  }

  private callAdaptorObserver(adaptor: Adaptor) {
    const observer = this.adaptorToObserver.get(adaptor);
    if (observer) {
      observer(adaptor.router);
    }
  }

  private registerServer(): EnlaceServer {
    Injector.shard.register(EnlaceServer);
    return Injector.shard.resolve(EnlaceServer);
  }

  private registerApplication(app: Application): Application {
    Injector.shard.register(this.ApplicationKey, app);
    return Injector.shard.resolve(this.ApplicationKey);
  }

  private setEventsInAdaptor() {
    const eventsMark = getEventsMarkInApplication(this.app);
    for (const mark of eventsMark) {
      if (mark.type === ApplicationEvents.onAddAdaptor) {
        const adaptorMark = mark as AddAdaptorApplicationEventMark;
        // todo 检查adaptor是否在server里
        this.adaptorToObserver.set(adaptorMark.meta, adaptorMark.target);
      }
    }
  }

}
