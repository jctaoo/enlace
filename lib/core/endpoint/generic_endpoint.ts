import { Endpoint, isEndpoint } from "./endpoint.ts";
import { EnlaceServer } from "../server.ts";
import { GenericEndpointInput } from "./endpoint_input.ts";
import { Reflect } from "../../../third_party/Reflect.ts";
import { ENDPOINT_CONFIG_KEY } from "../../decorators/metadata_keys.ts";
import { EndpointConfig, isEndpointConfig } from "./endpoint_config.ts";
import { Constructor, Log, Util } from "../../util/mod.ts";

let __useArrowFunction: boolean;

/**
 * Class style Endpoint.
 * @see Endpoint
 */
export abstract class ClassEndpoint implements Endpoint {

  /**
   * @see Endpoint.receive
   */
  abstract receive(input: GenericEndpointInput): any | Promise<any>;

}

/**
 * Function style Endpoint.
 * @see Endpoint
 * @see Endpoint.receive
 */
export type FunctionEndpoint = (input: any) => any | Promise<any>;


/**
 * Used when the form (class or function) of the endpoint is unknown.
 */
export type GenericEndpoint = Constructor<ClassEndpoint> | Endpoint | FunctionEndpoint;

export function toEndpoint(endpoint: GenericEndpoint): Endpoint {
  // instance of ClassEndpoint
  if (endpoint instanceof ClassEndpoint) {
    return endpoint;
  }

  // constructor of ClassEndpoint
  const config: EndpointConfig = Reflect.getMetadata(ENDPOINT_CONFIG_KEY, endpoint);
  if (config && isEndpointConfig(config)) {
    return new (endpoint as Constructor<ClassEndpoint>)();
  }

  // Endpoint interface
  if (isEndpoint(endpoint)) {
    return endpoint as Endpoint;
  }

  // function endpoint
  if (__useArrowFunction === undefined) {
    if (Util.canBeConstructed(endpoint)) {
      // use function name() { ... }
      __useArrowFunction = false;
    } else {
      // use name() => { ... }
      __useArrowFunction = false;
    }
  } else {
    if (Util.canBeConstructed(endpoint) && __useArrowFunction) {
      Log.warning(
        "We recommend that you do not use the arrow function " +
        "and es5 function at the same time in the project"
      );
    }
  }
  return { receive: endpoint as FunctionEndpoint };
}
