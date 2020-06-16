export const path_to_url = (proto: string, header: Headers, path: string) => {
  const protool = proto.split("/")[0].toLowerCase();
  return new URL(
    `${protool}://${header.get("host")}${path}`,
  );
};
