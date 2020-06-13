import { Adaptor, AdaptorConfigure } from "../core/adaptor.ts";
import { EnlaceEnvironment } from "../core/envrionment.ts";
import { Constructor } from "../injector_type.ts";
import { getParams, Injector } from "../core/injector.ts";
import ApplicationEventsMark from "./application_events_mark.ts";
import ApplicationEvents from "../application_events.ts";
import { Reflect } from "../../third_party/Reflect.ts";
import { APPLICATION_EVENTS_MARK_KEY } from "./metadata_keys.ts";
import { Log } from "../util/mod.ts";

export type AddAdaptorApplicationEventMark = ApplicationEventsMark<Adaptor>;

// todo do not use Constructor
// todo default AdaptorConfigure
// todo 与application configure的顺序
export function AddAdaptor(adaptorConstructor: Constructor<Adaptor>, configure: AdaptorConfigure): MethodDecorator {
  Injector.shard.register(adaptorConstructor);
  const adaptor = Injector.shard.resolve(adaptorConstructor);
  EnlaceEnvironment.shard.server.addAdaptorWithConfigure(adaptor, configure);
  return (target, propertyKey, descriptor) => {
    const defaultTarget = function() {
      Log.error("no target found.")
    }
    // todo
    const mark: AddAdaptorApplicationEventMark = {
      type: ApplicationEvents.onAddAdaptor,
      meta: adaptor,
      target: <Function>(descriptor.value ?? defaultTarget),
    }
    Reflect.defineMetadata(APPLICATION_EVENTS_MARK_KEY, mark, descriptor.value);
  };
}