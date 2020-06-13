import { getParams, typeInfo } from "../core/injector.ts";

export const injectable: ClassDecorator = (target) => {
  getParams(target);
}

