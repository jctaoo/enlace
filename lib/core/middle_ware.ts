import { Endpoint, EndpointInput } from "./endpoint.ts";
import { Util } from "../util/mod.ts";

export type MiddleWare = (input: EndpointInput<any, any>, next: Function) => void | Promise<void>;

export interface MiddleWareConfigure {
  expectedPath: string;
}
export type MiddleWareWithConfigure = { configure: MiddleWareConfigure, middleWare: MiddleWare };
