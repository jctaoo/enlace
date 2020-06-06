import { UnknownEndpointInput } from "./endpoint_input.ts";
import { ClassEndpoint } from "./core/endpoint.ts";

/**
 * Used to support network protocols that need to be returned 
 * immediately after receiving a client request.
 */
export abstract class NormalEndpoint extends ClassEndpoint {

  /**
   * @see Endpoint.recieve
   */
  abstract receive(input: UnknownEndpointInput): any | Promise<any>;

}