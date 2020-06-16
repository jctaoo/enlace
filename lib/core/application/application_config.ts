export interface ApplicationConfig {
  scan: boolean
}

export function isApplicationConfig(obj: any): boolean {
  return typeof obj === "object" &&
    "scan" in obj;
}
