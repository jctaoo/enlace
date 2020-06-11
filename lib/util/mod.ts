import { isJson, isFunction, isConstructor } from './type_validation.ts'
import { matchPath, parsePath, PathParameter } from "./match-path.ts";
import { pathToUrl } from "./path-to-url.ts";
import LogClass from './log.ts';
import TF from './true_function.ts';

export const Util = {
  isJson,
  isFunction,
  isConstructor,
  matchPath,
  parsePath,
  pathToUrl,
};

export type int = number;
export const Log = LogClass;
export const TrueFunction = TF;
