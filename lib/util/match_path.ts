import { PathParameter } from "./types.ts";

export function matchPath(path: string, expectedPath: string): boolean {
  expectedPath = expectedPath.replace(/\*/g, ".*");
  const regxToValidate = RegExp(expectedPath.replace(/:\([^\)].+?\)/g, ".*"));
  const result = regxToValidate.exec(path);
  if (result) {
    return result[0] === path;
  } else {
    return false
  }
};

export function parsePath(
  path: string,
  expectedPath: string,
): PathParameter {
  expectedPath = expectedPath.replace(/\*/g, ".*");
  const parameters: PathParameter = {};
  const regxToExtractParameters = RegExp(
    expectedPath.replace(/:\([^\)].+?\)/g, ":\\((.+)\\)"),
  );
  const regxToExtractArguments = RegExp(
    expectedPath.replace(/:\([^\)].+?\)/g, "(.+)"),
  );
  const extractedParameters = expectedPath.match(regxToExtractParameters)
    ?.slice(1);
  const extractedArguments = path.match(regxToExtractArguments)?.slice(1);
  if (extractedParameters && extractedArguments) {
    extractedParameters.forEach((name, index) =>
      parameters[name] = extractedArguments[index]
    );
  }
  return parameters;
};
