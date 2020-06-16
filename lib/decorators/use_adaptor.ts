import { Application } from "../core/application/application.ts";
import { Injector } from "../core/injector/injector.ts";
import { Environment } from "../core/envrionment.ts";
import { Adaptor } from "../core/adaptor/adaptor.ts";
import { Constructor } from "../util/types.ts";

export const useAdaptor = <T extends Adaptor>(constructor: Constructor<T>): T => {
  return Injector.shard.resolve(constructor);
}