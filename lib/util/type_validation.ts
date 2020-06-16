export function canBeConstructed(fn: any): boolean {
  try {
    new fn();
    return true;
  } catch {
    return false;
  }
}

export function isFunction(obj: any): boolean {
  return typeof obj === 'function';
}

export function isJson(obj: any): object | false {
  try {
    return JSON.parse(obj);
  } catch {
    return false;
  }
}