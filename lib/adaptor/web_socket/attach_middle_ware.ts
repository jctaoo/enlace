import { MiddleWare } from "../../core/middleware.ts";
import { HttpEndpointInput } from "../http-adaptor/endpoint-input.ts";
import { UnknownEndpointInput } from "../../endpoint_input.ts";

type AttachWebSocketCreator = (callBack: (input: HttpEndpointInput) => void) => MiddleWare;

export const attachWebSocket: AttachWebSocketCreator= (callBack): MiddleWare => {
  return (input: UnknownEndpointInput, next: Function) => {
    if (input instanceof HttpEndpointInput) {
      const httpInput = input as HttpEndpointInput;
      if (httpInput && httpInput.header && httpInput.header('Upgrade') === 'websocket') {
        callBack(httpInput);
      } 
    } 
    next();
  };
};