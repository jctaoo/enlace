import { Command } from "commander";
import * as inquirer from "inquirer";
import { generateApp } from "./create_app";
import { EnlaceApplicationPart, enlaceApplicationPartItems, generatePart } from "./generate_part";
import { parsePartString } from "./generate_part"
import { LOGO, PROJECT_NAME } from "./constant";
import { green, blue, red } from "chalk";
import os from "os";
import { exec, ExecException } from "child_process";
import { updateCLI } from "./update";

exec('deno --version', (error: ExecException | null, stdout: string, stderr: string) => {
  if (error || stderr) {
    // todo 更详尽的说明
    console.error(red('You have not installed deno, please check https://deno.land.'));
    process.exit(100);
  } else {
    // handle deno
    let parts = stdout.split(os.EOL)
    parts = parts.slice(0, parts.length - 1)
    // todo
    let deno: string = "";
    let v8: string = "";
    let typescript: string = "";
    for (const item of parts) {
      const parts = item.split(' ');
      const title = parts[0];
      const version = parts[1];
      switch (title) {
        case 'deno':
          deno = version;
          break;
        case 'v8':
          v8 = version
          break;
        case 'typescript':
          typescript = version;
          break;
        default:
          break;
      }
    }
    // handle package.json
    const cli = require('../package.json').version;

    main(process.argv, { deno, v8, typescript, cli });
  }
})

function main(argv: string[], { deno, v8, typescript, cli }: { deno: string, v8: string, typescript: string, cli: string }) {
  const version = process.version;
  const program = new Command();
  program.version(version);

  program
    .command('create [app_name] [relative_path]')
    .description('generate enlace application')
    .action(async (appName?: string, relativePath?: string) => {
      // handle app name
      let name: string = appName ?? "";
      if (!name) {
        const answer: { appName: string } = await inquirer.prompt({
          type: 'input',
          name: 'appName',
          message: 'please input your app name:',
          validate(input: string): boolean | string {
            const isOk = !!input
            return isOk ? isOk : "name is empty"
          }
        })
        name = answer.appName;
      }
      // handle relative path
      let path: string = relativePath ?? "./";

      generateApp(name, path);
    });

  program
    .command('generate [part_type] [part_name] [relative_path]')
    .description('generate a part of enlace app')
    .action(async (partType?: string, partName?: string, relativePath?: string) => {
      // handle type
      let type: EnlaceApplicationPart;
      const parsedType = parsePartString(partType ?? "");
      if (!parsedType) {
        const answer: { type: EnlaceApplicationPart } = await inquirer.prompt({
          type: "list",
          name: "type",
          message: "please select the type of part you want to create:",
          choices: enlaceApplicationPartItems,
        })
        type = answer.type;
      } else {
        type = parsedType;
      }
      // handle name
      let name: string = partName ?? "";
      if (!name) {
        const answer: { partName: string } = await inquirer.prompt({
          type: 'input',
          name: 'partName',
          message: 'please input your part name:',
          validate(input: string): boolean | string {
            const isOk = !!input
            return isOk ? isOk : "name is empty"
          }
        })
        name = answer.partName;
      }
      // handle path
      let path: string = relativePath ?? "./";

      generatePart(type, name, path);
    });

  program
    .command('info')
    .description('display enlace cli details')
    .action(() => {
      console.log(LOGO);
      console.log("\n");
      console.log(green("[system Information]"));
      console.log('OS Version: ', blue(`${os.platform()} ${os.arch()} ${os.release()}`));
      console.log('Deno Version: ', blue(`${deno}`));
      console.log('v8 Version: ', blue`${v8}`);
      console.log('typescript Version: ', blue`${typescript}`);
      console.log('NodeJS Version: ', blue(`${process.version}`));
      console.log(green(`\n[${PROJECT_NAME} Information]`));
      console.log('cli Version: ', blue`${cli}`);
    });

  program
    .command('update')
    .description('update enlace_cli')
    .action(updateCLI)

  program.parse(argv);
}
