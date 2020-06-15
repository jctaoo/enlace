import { PROJECT_NAME, LOGO, EnlaceCliVersion } from "./constant.ts";
import { green, blue } from "https://deno.land/std/fmt/colors.ts";

export function printInfo() {
  console.log("\n");
  console.log(LOGO);
  console.log("\n");
  console.log(green("[system Information]"));
  console.log('OS Version: ', blue(`${EnlaceCliVersion.os} ${EnlaceCliVersion.arch}`));
  console.log('Deno Version: ', blue(`${EnlaceCliVersion.deno}`));
  console.log('v8 Version: ', blue(`${EnlaceCliVersion.v8}`));
  console.log('typescript Version: ', blue(`${EnlaceCliVersion.typescript}`));
  console.log(green(`\n[${PROJECT_NAME} Information]`));
  console.log('cli Version: ', blue(`${EnlaceCliVersion.cli}`));
}