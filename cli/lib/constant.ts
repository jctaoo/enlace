export const EnlaceCliVersion = {
  ...Deno.version,
  cli: "0.0.1",
  os: Deno.build.os,
  arch: Deno.build.arch,
};
export const LOGO: string =
  "\t" + "  ___  ____  / /___ _________ " + "\n" +
  "\t" + " / _ \\/ __ \\/ / __ `/ ___/ _ \\" + "\n" +
  "\t" + "/  __/ / / / / /_/ / /__/  __/" + "\n" +
  "\t" + "\\___/_/ /_/_/\\__,_/\\___/\\___/ " + "\n";

export const PROJECT_NAME = "enlace_cli";

export const HOST_PROJECT_NAME = "enlace";