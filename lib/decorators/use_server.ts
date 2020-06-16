import { EnlaceServer, Injector } from "../core/mod.ts";

export const useServer = (): EnlaceServer => {
  return Injector.shard.resolve(EnlaceServer)
}

// todo
// export const Server: ParameterDecorator = () => {
//
// }