import { Middleware } from "./middleware.ts";

export interface MiddlewareConfig {
  /**
   * The rules of use are the same as the endpoint.
   * @see EndpointConfigure.expectedPath
   */
  expectedPath: string;
}

export type MiddleWareWithConfigure = {
  configure: MiddlewareConfig,
  middleWare: Middleware
};

export function MiddlewareConfig(obj: any): boolean {
  return typeof obj === "object" &&
    "expectedPath" in obj;
}