import { EndpointInput, Client } from "../../core/endpoint.ts";
import {
  acceptWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  WebSocket,
  WebSocketEvent,
  isWebSocketPongEvent,
} from "https://deno.land/std/ws/mod.ts";
import { PathParameter } from "../../util/match-path.ts";
import { Util } from "../../util/mod.ts";

export type WebSocketMeta = WebSocket;
export type WebSocketBody = WebSocketEvent;

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