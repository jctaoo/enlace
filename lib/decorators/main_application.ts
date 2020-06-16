import {
  Application,
  ApplicationConfig,
  isApplicationConfig,
  Environment,
} from '../core/mod.ts';
import ApplicationEventsMark from "./application_events_mark.ts";
import { Reflect } from "../../third_party/Reflect.ts";
import { APPLICATION_EVENTS_MARK_KEY } from "./metadata_keys.ts";
import { Constructor, Util } from "../util/mod.ts";

export function MainApplication(config: ApplicationConfig): ClassDecorator;
export function MainApplication(target: Function): void;
export function MainApplication(arg: any): any {
  const fn = (target: Constructor<Application>, config?: ApplicationConfig) => {
    // todo check Application
    Environment.shard.run(new target(config)).then();
  }
  if (isApplicationConfig(arg)) {
    return fn
  }
  fn(arg);
}

export function getEventsMarkInApplication(application: Application): ApplicationEventsMark[] {
  const prototype = Object.getPrototypeOf(application);
  const methodName = Object.getOwnPropertyNames(prototype)
    .filter(item => Util.isFunction(prototype[item]) && !Util.canBeConstructed(prototype[item]));

  return methodName.map(method => {
    const fn = prototype[method];
    const configure: ApplicationEventsMark = Reflect.getMetadata(APPLICATION_EVENTS_MARK_KEY, fn);
    return configure;
  }).filter(i => i)
  // todo 关于去重复，参考swift里的compactMap
}




