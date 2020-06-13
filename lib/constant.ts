import { int, TrueFunction } from "./util/mod.ts";
import { EnlaceApplicationConfigure } from "./core/application.ts";
import { EndpointConfigure } from "./core/endpoint.ts";
import { MiddleWareConfigure } from "./core/middleware.ts";
import { AdaptorConfigure } from "./core/adaptor.ts";

export const DEFAULT_PORT: int = 20203;
export const DEFAULT_HOST: string = "0.0.0.0";
export const LOGO: string =
  "\t" + "  ___  ____  / /___ _________ " + "\n" +
  "\t" + " / _ \\/ __ \\/ / __ `/ ___/ _ \\" + "\n" +
  "\t" + "/  __/ / / / / /_/ / /__/  __/" + "\n" +
  "\t" + "\\___/_/ /_/_/\\__,_/\\___/\\___/ " + "\n";

export const PROJECT_NAME: string = 'enlace'

export const WELCOME_WORDS: string = "starting...\n"

export const DEFAULT_APP_CONFIG: EnlaceApplicationConfigure = {
  scan: false,
}

export const DEFAULT_ADAPTOR_CONFIG: AdaptorConfigure = {
  host: DEFAULT_HOST,
  port: DEFAULT_PORT,
}

export const DEFAULT_ENDPOINT_CONFIG: EndpointConfigure = {
  expectedPath: "*",
  selectAdaptor: TrueFunction,
}

export const DEFAULT_MIDDLEWARE_CONFIG: MiddleWareConfigure = {
  expectedPath: "*",
}
