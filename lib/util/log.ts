import {
  bold,
  black,
  yellow,
  white,
  bgRed,
  bgGreen,
  green,
  bgYellow,
  red,
} from "https://deno.land/std/fmt/colors.ts";

class Log {
  static info(message: string, tag: string = "") {
    const coloredTag = yellow(bold(`[${tag}]  `));
    const coloredMessage = white(message);
    console.log((coloredTag ? `${tag === "" ? "" : coloredTag}` : "") + coloredMessage);
  }

  static success(message: string) {
    const coloredMessage = green(bold(message));
    console.log(coloredMessage);
  }

  static warning(message: string) {
    const coloredMessage = yellow(bold(message));
    console.log(coloredMessage);
  }

  static error(message: string) {
    const coloredMessage = red(bold(message));
    console.log(coloredMessage);
  }

  static async ask(question: string = ""): Promise<string> {
    await Deno.stdout.write(new TextEncoder().encode(question));
    const buf = new Uint8Array(1024);
    const n = <number>await Deno.stdin.read(buf);
    const input = new TextDecoder().decode(buf.subarray(0, n));
    return input;
  }
}

export default Log;
