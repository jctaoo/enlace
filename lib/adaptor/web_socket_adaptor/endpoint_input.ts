import {
  isWebSocketPingEvent,
  WebSocket,
  WebSocketEvent,
  isWebSocketPongEvent,
} from "https://deno.land/std/ws/mod.ts";
import { PathParameter } from "../../util/types.ts";
import { Util } from "../../util/mod.ts";
import { EndpointInput } from "../../core/endpoint/endpoint_input.ts";
import { Client } from "../../client.ts";

type WebSocketMeta = WebSocket;
type WebSocketBody = WebSocketEvent;

export class WebSocketEndpointInput implements EndpointInput<WebSocketMeta, WebSocketBody> {

  protocol: string = "WebSocket";
  client: Client;
  path: string;
  meta: WebSocket;
  parameters = {};
  body: WebSocketBody;
  pathParameters: PathParameter = {};

  constructor(path: string, meta: WebSocket, event: WebSocketBody) {
    const ip = meta.conn.remoteAddr;
    this.client = Client.generate(ip);
    this.meta = meta;
    this.path = path;
    this.body = event;
  }

  public parameter(key: string) { return null; }

  public get json(): object | null {
    const json = Util.isJson(this.body);
    return json || null;
  }

  public get binary(): Uint8Array | null {
    if (this.body instanceof Uint8Array) {
      return this.body;
    }
    return null;
  }

  public get isPing(): boolean {
    return isWebSocketPingEvent(this.body);
  }

  public get isPong(): boolean {
    return isWebSocketPongEvent(this.body);
  }

}