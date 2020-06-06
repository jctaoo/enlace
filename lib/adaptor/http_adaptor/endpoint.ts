import { HttpEndpointInput } from "./endpoint_input.ts";
import { NormalEndpoint } from "../../normal_endpoint.ts";

export abstract class HttpEndpoint extends NormalEndpoint {
  abstract receive(input: HttpEndpointInput): unknown | Promise<unknown>;
}
