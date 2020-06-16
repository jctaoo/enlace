import { Application, Injector, Environment } from "../core/mod.ts";

export const useApplication = <T extends Application>(): T => {
  return Injector.shard.resolve(Environment.shard.ApplicationKey);
}