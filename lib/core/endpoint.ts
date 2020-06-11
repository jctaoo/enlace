import { Adaptor } from "./adaptor.ts";
import { EnlaceServer } from "./server.ts";
import { UnknownEndpointInput } from "../endpoint_input.ts";

export interface EndpointConfigure {
  /**
   * A path template to be matched with actual-path. Allow path parameters
   *  and wildcard. Examples:
   * 
   *    - /pic
   *    - join-:(room_id) (uisng path parameters)
   *    - /pic/:(pic_name)/info (using path parameters)
   *    - /pic/id-*.png/ (using wildcard)
   *    - /pic/id-:(pic_id).png/* (using path parameters and wildcard)
   * 
   * @see EndpointInput.pathParameters
   */
  expectedPath: string;

  /**
   * A callback function called by EnlaceServer gives Endpoint the ability to 
   * dynamically select an adapter。
   */
  selectAdaptor: (adaptor: Adaptor) => boolean;
}

export function combineEndpointConfigure(lhs: EndpointConfigure, rhs: EndpointConfigure): EndpointConfigure {
  if (lhs.expectedPath.endsWith('/')) {
    lhs.expectedPath = lhs.expectedPath.slice(0, lhs.expectedPath.length - 1);
  }
  const expectedPath = lhs.expectedPath + rhs.expectedPath;
  const selectAdaptor = rhs.selectAdaptor;
  return { expectedPath, selectAdaptor };
}

/**
 * Used when the form (class or function) of the endpoint is unknown.
 */
export type UnkonwnEndpoint = typeof ClassEndpoint | Endpoint | FunctionEndpoint;

/**
 * Describe the parameters and behavior of the endpoint regardless of whether 
 * the form of the endpoint is a function or a class.
 */
export interface Endpoint {
  /**
   * This value is empty when the Adaptor is not added to EnlaceServer.
   */
  server: EnlaceServer | null;

  /**
   * A callback function called by EnlaceServer when the request from the client matches 
   * the configuration of this endpoint.
   * 
   * @param input package of the message from the client in the network request.
   */
  receive(input: UnknownEndpointInput): any | Promise<any>;
}

/**
 * Function style Endpoint.
 * @see Endpoint
 * @see Endpoint.receive
 */
export type FunctionEndpoint = (input: any) => any | Promise<any>;

/**
 * Class style Endpoint.
 * @see Endpoint
 */
export abstract class ClassEndpoint implements Endpoint {

  /**
   * @see Endpoint.server
   */
  server!: EnlaceServer;

  /**
   * @see Endpoint.receive
   */
  abstract receive(input: UnknownEndpointInput): any | Promise<any>;

}

export const convertUnkonwnEndpointToEndpoint = (endpoint: UnkonwnEndpoint): Endpoint => {
  if (endpoint instanceof ClassEndpoint) {
    return endpoint;
  } else if ('receive' in endpoint && 'server' in endpoint) {
    return endpoint;
  } else if (typeof endpoint === 'function') {
    try {
      // todo 优化判断方式
      // @ts-ignore
      return new (endpoint as typeof ClassEndpoint)();
    } catch {
      return { receive: endpoint as FunctionEndpoint, server: null };
    }
  }
  return endpoint;
}

export type EndpointWithConfigure = {
  configure: EndpointConfigure;
  endpoint: Endpoint;
};