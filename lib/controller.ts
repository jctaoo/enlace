import {
  EndpointWithConfigure,
  toEndpoint,
  combineEndpointConfigure,
} from "./core/mod.ts";
import { Util } from "./util/mod.ts";
import { Reflect } from "../third_party/Reflect.ts";
import { ENDPOINT_CONFIG_KEY } from "./decorators/metadata_keys.ts";

// todo 考虑要不要加上这个东西
// abstract class Controller {
//
// }

function isController(controller: Object): boolean {
  return !!Reflect.getMetadata(ENDPOINT_CONFIG_KEY, controller.constructor);
}

function getEndpointsInController(controller: Object): EndpointWithConfigure[] {
  const rootConfigure = Reflect.getMetadata(ENDPOINT_CONFIG_KEY, controller.constructor);
  
  const prototype = Object.getPrototypeOf(controller);
  const methodName = Object.getOwnPropertyNames(prototype)
    .filter(item => Util.isFunction(prototype[item]) && !Util.canBeConstructed(prototype[item]));

  return methodName.map(method => {
    const fn = prototype[method];
    const configure = Reflect.getMetadata(ENDPOINT_CONFIG_KEY, fn);
    return { 
      configure: combineEndpointConfigure(rootConfigure, configure), 
      endpoint: toEndpoint(fn)
    };
  });
}

export { isController, getEndpointsInController };