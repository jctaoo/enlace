import { GenericEndpointInput } from "../endpoint/endpoint_input.ts";

export type Middleware = (input: GenericEndpointInput, next: Function) => void | Promise<void>;