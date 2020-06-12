import { typeInfo } from "../core/injector.ts";
import { Reflect } from "../../third_party/Reflect.ts";

export const injectable: ClassDecorator = (target) => {
  getParams(target);
}

function getParams(target: any) {
  typeInfo.set(target, Reflect.getMetadata('design:paramtypes', target));
}
