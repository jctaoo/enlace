import { EndpointWithConfigure, convertUnkonwnEndpointToEndpoint } from "./core/mod.ts";
import { Util } from "./util/mod.ts";
import { Reflect } from "../third_party/Reflect.ts";
import { ENDPOINT_CONFIGURE_KEY } from "./decorators/metadata_keys.ts";
import { combineEndpointConfigure } from "./core/endpoint.ts";

// abstract class Controller {
//
// }

function isController(controller: Object): boolean {
  return !!Reflect.getMetadata(ENDPOINT_CONFIGURE_KEY, controller.constructor);
}

function getEndpointsInController(controller: Object): EndpointWithConfigure[] {
  const rootConfigure = Reflect.getMetadata(ENDPOINT_CONFIGURE_KEY, controller.constructor);
  
  const prototype = Object.getPrototypeOf(controller);
  const methodName = Object.getOwnPropertyNames(prototype)
    .filter(item => Util.isFunction(prototype[item]) && !Util.isConstructor(prototype[item]));

  return methodName.map(method => {
    const fn = prototype[method];
    const configure = Reflect.getMetadata(ENDPOINT_CONFIGURE_KEY, fn);
    return { 
      configure: combineEndpointConfigure(rootConfigure, configure), 
      endpoint: convertUnkonwnEndpointToEndpoint(fn) 
    };
  });
}

export { isController, getEndpointsInController };