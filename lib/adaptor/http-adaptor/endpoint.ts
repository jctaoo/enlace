import { NormalEndpoint } from "../../endpoint/endpoint.ts";
import { HttpInputMeta, HttpEndpointInput } from "./endpoint-input.ts";

abstract class HttpEndpoint extends NormalEndpoint<HttpInputMeta> {
  abstract receive(input: HttpEndpointInput): any;
}

export default HttpEndpoint;