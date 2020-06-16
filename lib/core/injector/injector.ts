import {
  InjectItem,
  InjectedItemProvider,
  isFactory,
  Factory
} from './injector_type.ts';
import { Reflect } from "../../../third_party/Reflect.ts";
import { Constructor } from "../../util/mod.ts";

export const typeInfo: Map<Constructor<any>, Constructor<any>[]> = new Map();

export function getParams(target: any) {
  typeInfo.set(target, Reflect.getMetadata('design:paramtypes', target));
}

export class Injector {

  public static shard = new Injector();
  private constructor() { }
  private itemToProvider: Map<InjectItem, InjectedItemProvider> = new Map();

  /** Constructor */
  public register<T>(item: Constructor<T>): void;
  public register<T>(item: InjectItem, value: T): void;
  public register<T>(item: InjectItem, factory: Factory<T>): void;
  public register<T>(item: InjectItem, value?: T | Factory<T>): void {
    /** Constructor */
    if (!value) {
      const create = (): T => {
        return this.construct(item as Constructor<T>);
      };
      this.itemToProvider.set(item, { get: create });
    }

    /** Factory */
    if (value && isFactory(value)) {
      this.itemToProvider.set(item, { get: (value as Factory<T>).create })
    }

    /** Value */
    if (value) {
      const create = (): T => {
        return value as T;
      }
      this.itemToProvider.set(item, { get: create });
    }
  }

  /** Constructor */
  public resolve<T>(item: Constructor<T>): T;
  public resolve<T>(item: string | symbol): T;
  public resolve<T>(item: InjectItem<T>): T | null {
    const provider = this.itemToProvider.get(item);
    return provider?.get();
  }

  #stored: Map<Constructor<unknown>, unknown> = new Map();
  private construct<T>(constructor: Constructor<T>): T {
    const stored = this.#stored.get(constructor as Constructor<T>);
    if (stored) { return stored as T; }

    const paramsTypes = typeInfo.get(constructor);
    const params = !!paramsTypes ? paramsTypes.map((item, index) => {
      const provider = this.itemToProvider.get(item);
      if (provider) {
        return provider.get();
      } else {
        // todo
      }
    }) : [];
    const instance = new constructor(...params);
    this.#stored.set(constructor, instance);
    return instance
  }

}
