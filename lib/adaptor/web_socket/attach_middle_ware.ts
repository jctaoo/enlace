import { MiddleWare } from "../../core/middle_ware.ts";
import { EndpointInput } from "../../core/endpoint.ts";
import { HttpEndpointInput } from "../http-adaptor/endpoint-input.ts";

type AttachWebSocketCreator = (callBack: (input: HttpEndpointInput) => void) => MiddleWare;
export const attachWebSocket: AttachWebSocketCreator= (callBack): MiddleWare => {
  return (input: EndpointInput<any, any>, next: Function) => {
    const httpInput = input as HttpEndpointInput;
    if (httpInput && httpInput.header && httpInput.header('Upgrade') === 'websocket') {
      callBack(httpInput);
    } 
    next();
  };
};