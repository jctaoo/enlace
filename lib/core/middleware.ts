import { UnknownEndpointInput } from "../endpoint_input.ts";

export interface MiddleWareConfigure {
  /**
   * The rules of use are the same as the endpoint.
   * @see EndpointConfigure.expectedPath
   */
  expectedPath: string;
}

export type MiddleWare = (input: UnknownEndpointInput, next: Function) => void | Promise<void>;

export type MiddleWareWithConfigure = { 
  configure: MiddleWareConfigure, 
  middleWare: MiddleWare 
};