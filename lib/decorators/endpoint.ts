import { EndpointConfigure } from "../core/mod.ts";
import { Reflect } from '../../third_party/Reflect.ts'
import { ENDPOINT_CONFIGURE_KEY } from "./metadata_keys.ts";

function Endpint(configure: EndpointConfigure): MethodDecorator {
  return function(_target, _key, descriptor) {
    Reflect.defineMetadata(ENDPOINT_CONFIGURE_KEY, configure, descriptor.value);
  }
}

export { Endpint };