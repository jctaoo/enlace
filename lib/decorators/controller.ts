import { EndpointConfigure } from "../core/mod.ts";
import { Reflect } from '../../third_party/Reflect.ts'
import { ENDPOINT_CONFIGURE_KEY } from "./metadata_keys.ts";

function ControllerMapping(configure: EndpointConfigure): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ENDPOINT_CONFIGURE_KEY, configure, target);
  };
}

export { ControllerMapping };