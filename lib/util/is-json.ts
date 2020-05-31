const isJson = (obj: any): boolean | false => {
  try {
    return JSON.parse(obj);
  } catch {
    return false;
  }
} 

export default isJson;