import { getParams, typeInfo } from "../core/injector/injector.ts";

export const injectable: ClassDecorator = (target) => {
  getParams(target);
}

