import { Middleware } from "../../core/mod.ts";
import { HttpEndpointInput } from "../http_adaptor/mod.ts";
import { GenericEndpointInput } from "../../core/endpoint/endpoint_input.ts";

type AttachWebSocketCreator = (callBack: (input: HttpEndpointInput) => void) => Middleware;

export const attachWebSocket: AttachWebSocketCreator= (callBack): Middleware => {
  return (input: GenericEndpointInput, next: Function) => {
    if (input instanceof HttpEndpointInput) {
      const httpInput = input as HttpEndpointInput;
      if (httpInput && httpInput.header && httpInput.header('Upgrade') === 'websocket') {
        callBack(httpInput);
      } 
    } 
    next();
  };
};