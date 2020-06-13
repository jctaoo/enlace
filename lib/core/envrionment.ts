import { Application } from "./application.ts";
import { Injector } from "./injector.ts";
import { EnlaceServer } from "./server.ts";
import { Adaptor } from "./adaptor.ts";
import Log from "../util/log.ts";
import { getEventsMarkInApplication } from "../decorators/main_application.ts";
import ApplicationEvents from "../application_events.ts";
import { AddAdaptorApplicationEventMark } from "../decorators/add_adaptor.ts";
import { LOGO, PROJECT_NAME, WELCOME_WORDS } from "../constant.ts";

export class EnlaceEnvironment {

  public static shard = new EnlaceEnvironment();
  public server = new EnlaceServer();
  private app!: Application;
  private isReady: boolean = false;

  private adaptorToObserver: Map<Adaptor, Function> = new Map();

  private constructor() {
    this.server.adaptorsToConfigure.observeChange(updated => {
      if (this.isReady) {
        this.callAdaptorObserver(updated.key)
      }
    })
  }

  private initApp(app: Application) {
    if (!this.app) {
      console.clear();
      Log.success(WELCOME_WORDS, PROJECT_NAME);
      Log.info(LOGO);
      this.app = app;
      // init adaptorToObserver
      const eventsMark = getEventsMarkInApplication(app);
      for (const mark of eventsMark) {
        if (mark.type === ApplicationEvents.onAddAdaptor) {
          const adaptorMark = mark as AddAdaptorApplicationEventMark;
          // todo 检查adaptor是否在server里
          this.adaptorToObserver.set(adaptorMark.meta, adaptorMark.target);
        }
      }
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
      this.callAdaptorObserver(key);
    }
    this.app.onStartUp();
    Log.success("\nenlace is ready!!")
    Log.ask().then();
  }

  private callAdaptorObserver(adaptor: Adaptor) {
    const observer = this.adaptorToObserver.get(adaptor);
    if (observer) {
      observer(adaptor);
    }
  }

}
