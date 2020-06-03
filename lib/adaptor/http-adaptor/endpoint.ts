import { NormalEndpoint } from "../../core/endpoint.ts";
import { HttpInputMeta, HttpEndpointInput } from "./endpoint-input.ts";

abstract class HttpEndpoint extends NormalEndpoint<HttpInputMeta> {
  abstract receive(input: HttpEndpointInput): any;
}

export default HttpEndpoint;
