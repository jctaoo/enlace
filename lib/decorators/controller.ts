import { EndpointConfig } from "../core/mod.ts";
import { Reflect } from '../../third_party/Reflect.ts'
import { ENDPOINT_CONFIG_KEY } from "./metadata_keys.ts";

function ControllerMapping(config: EndpointConfig): ClassDecorator {
  return target => {
    Reflect.defineMetadata(ENDPOINT_CONFIG_KEY, config, target);
  };
}

export { ControllerMapping };