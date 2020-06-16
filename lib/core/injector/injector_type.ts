import { Constructor } from "../../util/mod.ts";

export type InjectItem<T = any> = Constructor<T> | string | symbol;

export interface InjectedItemProvider<T = any> {
  get: () => T;
}

export interface Factory<T = any> {
  create: () => T
}

export function isFactory(obj: any): boolean {
  return !!(obj as Factory).create;
}