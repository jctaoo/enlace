import LogClass from "./log.ts";

export type int = number;
export const Log = LogClass;
export const TrueFunction = (...arg: unknown[]) => true;
export type PathParameter = { [key: string]: string };
export type Constructor<T> = {
  new(...args: any[]): T;
};