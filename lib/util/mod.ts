import { isJson, isFunction, canBeConstructed } from './type_validation.ts'
import { matchPath, parsePath } from "./match_path.ts";
import { path_to_url } from "./path_to_url.ts";

export const Util = {
  isJson,
  isFunction,
  canBeConstructed,
  matchPath,
  parsePath,
  pathToUrl: path_to_url,
};

export * from "./types.ts";
export * from "./observable_map.ts";
export * from "./log.ts";