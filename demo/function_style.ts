import {
  Application
} from "../lib/core/mod.ts";
import { blue } from "https://deno.land/std/fmt/colors.ts";
import {
  HttpAdaptor,
  WebSocketAdaptor,
  WebSocketEndpointInput
} from "../lib/adaptor/mod.ts";
import {
  AddAdaptor,
  MainApplication
} from "../lib/decorators/mod.ts";

function Home() {
  return "<h1>Welcome</h1>"
}

function Room(ws: WebSocketEndpointInput) {
  return "room" + ws.pathParameters['room'];
}

function GlobalRoom(ws: WebSocketEndpointInput) {
  return "Hello";
}


@MainApplication
class FunctionStyleApplication extends Application {

  onStartUp() {
    console.log(blue("prepare done. enjoy function style enlace!!"));
  }

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(httpAdaptor: HttpAdaptor) {
    httpAdaptor.router
      .useEndpointOn("/", Home)
  }

  @AddAdaptor(WebSocketAdaptor)
  onAddWsAdaptor(wsAdaptor: WebSocketAdaptor) {
    wsAdaptor.router
      .useEndpointOn("/global", GlobalRoom)
      .useEndpointOn("/room/:(id)", Room);
  }

}