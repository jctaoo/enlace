import { Application, EnlaceApplicationConfigure, isEnlaceApplicationConfigure } from '../core/application.ts';
import Log from '../util/log.ts';
import { EnlaceEnvironment } from '../core/envrionment.ts';
import { Constructor } from '../injector_type.ts';
import ApplicationEventsMark from "./application_events_mark.ts";
import { Reflect } from "../../third_party/Reflect.ts";
import { APPLICATION_EVENTS_MARK_KEY, ENDPOINT_CONFIGURE_KEY } from "./metadata_keys.ts";
import { Util } from "../util/mod.ts";
import { combineEndpointConfigure } from "../core/endpoint.ts";
import { convertUnkonwnEndpointToEndpoint } from "../core/endpoint.ts";
import { LOGO } from "../constant.ts";

// todo 不要引用 Constructor
export function MainApplication(configure: EnlaceApplicationConfigure): (target: Constructor<Application>) => void;
export function MainApplication(target: Constructor<Application>): void;
export function MainApplication(arg: any): any {
  const fn = (target: Constructor<Application>, configure?: EnlaceApplicationConfigure) => {
    // todo check Application
    EnlaceEnvironment.shard.run(new target(configure)).then();
  }
  if (isEnlaceApplicationConfigure(arg)) {
    return fn
  }
  fn(arg);
}

export function getEventsMarkInApplication(application: Application): ApplicationEventsMark[] {
  const prototype = Object.getPrototypeOf(application);
  const methodName = Object.getOwnPropertyNames(prototype)
    .filter(item => Util.isFunction(prototype[item]) && !Util.isConstructor(prototype[item]));

  return methodName.map(method => {
    const fn = prototype[method];
    const configure: ApplicationEventsMark = Reflect.getMetadata(APPLICATION_EVENTS_MARK_KEY, fn);
    return configure;
  }).filter(i => i)
  // todo 关于去重复，参考swift里的compactMap
}




