import { HttpEndpointInput } from "./endpoint-input.ts";
import { NormalEndpoint } from "../../normal_endpoint.ts";

abstract class HttpEndpoint extends NormalEndpoint {
  abstract receive(input: HttpEndpointInput): unknown | Promise<unknown>;
}

export default HttpEndpoint;
