import isJson from "./is-json.ts";
import { matchPath } from "./match-path.ts";
import { pathToUrl } from "./path-to-url.ts";

type Opaque<T, K> = T & { __opaque__: K };

export const Util: {
  isJson: (obj: any) => false | object,
} = Object.create({
  isJson: isJson,
  matchPath: matchPath,
  pathToUrl: pathToUrl,
});

export type int = number;
