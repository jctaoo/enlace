import { GenericEndpointInput } from "./core/endpoint/endpoint_input.ts";
import { ClassEndpoint } from "./core/mod.ts";

/**
 * Used to support network protocols that need to be returned 
 * immediately after receiving a client request.
 */
export abstract class NormalEndpoint extends ClassEndpoint {

  /**
   * @see Endpoint.recieve
   */
  abstract receive(input: GenericEndpointInput): any | Promise<any>;

}