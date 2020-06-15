export enum EnlaceApplicationPart {
  controller = "controller|co",
  middleware = "middleware|mi",
  endpoint = "endpoint|en",
  adaptor = "adaptor|ad",
}

export const enlaceApplicationPartItems: { name: string, value: EnlaceApplicationPart }[] = Object.keys(EnlaceApplicationPart).map(key => {
  const name = key;
  const value = EnlaceApplicationPart[key as keyof typeof EnlaceApplicationPart];
  return { name, value };
})

export function parsePartString(string: string): EnlaceApplicationPart | null {
  for (const key in EnlaceApplicationPart) {
    if (EnlaceApplicationPart.hasOwnProperty(key)) {
      const value = EnlaceApplicationPart[key as keyof typeof EnlaceApplicationPart];
      const apart = (value as string).split('|');
      const full = apart[0];
      const abbreviation = apart[1];
      if (string === full || string === abbreviation) {
        return value;
      }
    }
  }
  return null;
}

export function generatePart(type: EnlaceApplicationPart, name: string, relativePath: string) {

}