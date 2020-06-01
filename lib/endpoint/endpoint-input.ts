import Client from "./client.ts";
import { PathParameter } from "../util/match-path.ts";

export default interface EndpointInput<Meta, Body> {
  protocol: string;
  client: Client;
  path: string;
  meta: Meta;
  parameters: { [key: string]: string };
  body?: Body;
  pathParameters: PathParameter;
  [propName: string]: any;
}
