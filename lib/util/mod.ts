import isJson from "./is-json.ts";
import { matchPath, parsePath, PathParameter } from "./match-path.ts";
import { pathToUrl } from "./path-to-url.ts";
import LogClass from './log.ts';

type Opaque<T, K> = T & { __opaque__: K };

export const Util: {
  isJson: (obj: any) => false | object;
  matchPath: (path: string, expectedPath: string) => boolean;
  parsePath: (path: string, expectedPath: string) => PathParameter;
} = Object.create({
  isJson,
  matchPath,
  parsePath,
  pathToUrl,
});
export const Log = LogClass;

export type int = number;
