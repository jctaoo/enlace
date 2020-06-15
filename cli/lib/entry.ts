// @deno-types="https://unpkg.com/cac/mod.d.ts"
import { cac } from 'https://unpkg.com/cac/mod.js'
import Ask from 'https://deno.land/x/ask/mod.ts';
import { generateApp } from "./create_app.ts";
import { HOST_PROJECT_NAME } from "./constant.ts";
import { EnlaceApplicationPart } from "./generate_part.ts";
import { generatePart, parsePartString } from "./generate_part.ts";
import { printInfo } from "./print_info.ts";
import { updateCLI } from "./update.ts";

// todo 错误参数处理
// todo 处理更新

const cli = cac(HOST_PROJECT_NAME);
cli.version("0.0.1", "-v, --version");
cli.help(() => {});
const ask = new Ask();
const defaultCommandOptions = {
  allowUnknownOptions: false,
  ignoreOptionDefaultValue: true,
};

async function main() {
  cli
    .command("create [app_name] [relative_path]", "generate enlace application", defaultCommandOptions)
    .action(async (appName?: string, relativePath?: string) => {
      // handle app name
      let name: string = appName ?? "";
      if (!name) {
        const answer = await ask.prompt([{
          type: 'input',
          name: 'appName',
          message: 'please input your app name:',
          validate(input: string): boolean {
            return !!input;
          }
        }]) as { appName: string }
        name = answer.appName;
      }
      // handle relative path
      let path: string = relativePath ?? "./";

      generateApp(name, path);
    });

  cli
    .command('generate [part_type] [part_name] [relative_path]', 'generate a part of enlace app', defaultCommandOptions)
    .action(async (partType?: string, partName?: string, relativePath?: string) => {
      // handle type
      let type: EnlaceApplicationPart;
      const parsedType = parsePartString(partType ?? "");
      if (!parsedType) {
        const answer = await ask.prompt([{
          type: "input",
          name: "type",
          message: "please select the type of part you want to create:",
          validate(input: string): boolean {
            return !!parsePartString(input);
          }
        }]) as { type: string }
        type = parsePartString(answer.type)!;
      } else {
        type = parsedType;
      }
      // handle name
      let name: string = partName ?? "";
      if (!name) {
        const answer = await ask.prompt([{
          type: 'input',
          name: 'partName',
          message: 'please input your part name:',
          validate(input: string): boolean {
            return !!input;
          }
        }]) as { partName: string };
        name = answer.partName;
      }
      // handle path
      let path: string = relativePath ?? "./";

      generatePart(type, name, path);
    });

  cli
    .command('info', 'display enlace cli details', defaultCommandOptions)
    .action(() => {
      printInfo()
    });

  cli
    .command('update', 'update enlace_cli', defaultCommandOptions)
    .action(updateCLI)

}

await main();
cli.parse();
if (Deno.args.length === 0) {
  cli.outputHelp();
}