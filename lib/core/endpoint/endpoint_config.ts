import { Adaptor } from "../adaptor/mod.ts";
import { Endpoint } from "./endpoint.ts";

export interface EndpointConfig {
  /**
   * A path template to be matched with actual-path. Allow path parameters
   *  and wildcard. Examples:
   *
   *    - /pic
   *    - join-:(room_id) (using path parameters)
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

export type EndpointWithConfigure = {
  configure: EndpointConfig;
  endpoint: Endpoint;
};

export function isEndpointConfig(obj: any): boolean {
  return typeof obj === "object" &&
    "expectedPath" in obj &&
    "selectAdaptor" in obj;
}

export function combineEndpointConfigure(lhs: EndpointConfig, rhs: EndpointConfig): EndpointConfig {
  if (lhs.expectedPath.endsWith('/')) {
    lhs.expectedPath = lhs.expectedPath.slice(0, lhs.expectedPath.length - 1);
  }
  const expectedPath = lhs.expectedPath + rhs.expectedPath;
  const selectAdaptor = rhs.selectAdaptor;
  return {expectedPath, selectAdaptor};
}