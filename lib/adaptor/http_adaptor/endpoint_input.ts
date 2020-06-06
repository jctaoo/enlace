import { ServerRequest } from "https://deno.land/std/http/server.ts";
import { PathParameter } from "../../util/match-path.ts";
import { MultipartReader, FormFile } from "https://deno.land/std/mime/mod.ts";
import { pathToUrl } from "../../util/path-to-url.ts";
import HttpMethod from "./method.ts";
import { Util } from "../../util/mod.ts";
import { EndpointInput } from "../../endpoint_input.ts";
import { Client } from "../../client.ts";

export type HttpInputMeta = ServerRequest;
export type HttpBody =
  | Uint8Array
  | Deno.Reader
  | boolean
  | number
  | string
  | object;
export type HttpSearchParameter = { [key: string]: string };

export class HttpEndpointInput implements EndpointInput<HttpInputMeta, HttpBody> {
  protocol: string = "Http";

  client: Client;
  path: string;
  meta: HttpInputMeta;
  body?: HttpBody;
  pathParameters: PathParameter = {};
  private decoder = new TextDecoder();

  constructor(path: string, meta: HttpInputMeta) {
    const ip = meta.conn.remoteAddr;
    this.client = Client.generate(ip);
    this.meta = meta;
    this.path = path;
  }

  public parameter(key: string) {
    return this.query(key);
  }

  get url(): URL {
    return pathToUrl(this.meta.proto, this.meta.headers, this.meta.url);
  }

  get method(): HttpMethod | string {
    return HttpMethod[this.meta.method as keyof typeof HttpMethod] ||
      this.meta.method;
  }

  get contentType(): string | null {
    return this.meta.headers.get("content-type");
  }

  header(key: string): string | null {
    const header = this.meta.headers.get(key);
    return header;
  }

  // TODO 尝试用 lazy 解决
  public queryParameters: { [key: string]: string } = {};
  query(key: string): string | null {
    return this.queryParameters[key] || null;
  }

  // TODO 尝试用 lazy 解决
  private $decodedBody?: string;
  async decodedBody(): Promise<string> {
    if (!this.$decodedBody) {
      const body = await Deno.readAll(this.meta.body);
      this.$decodedBody = this.decoder.decode(body);
    }
    return this.$decodedBody ?? "";
  }

  // TODO 尝试用 lazy 解决
  private $formBoundary: string | null = null;
  private checkBoundary() {
    if (this.$formBoundary == null) {
      const contentType = this.header("content-type");
      const matchResult = contentType?.match(/boundary=([^\s]+)/);
      if (matchResult) {
        this.$formBoundary = matchResult[1];
      }
    }
  }

  async binary(): Promise<Uint8Array | null> {
    const file = await Deno.readAll(this.meta.body);
    return file;
  }

  async json(): Promise<object | null> {
    const decodedBody = await this.decodedBody();
    const json = Util.isJson(decodedBody);
    return json || null;
  }

  async text(): Promise<string> {
    const decodedBody = await this.decodedBody();
    return decodedBody;
  }

  async form(key: string): Promise<string | null> {
    this.checkBoundary();
    if (this.$formBoundary) {
      const reader = new MultipartReader(this.meta.body, this.$formBoundary);
      const form = await reader.readForm();
      const value = form.value(key);
      return value ? value : null;
    }
    return null;
  }

  async fileFromForm(key: string): Promise<FormFile | null> {
    this.checkBoundary();
    if (this.$formBoundary) {
      const reader = new MultipartReader(this.meta.body, this.$formBoundary);
      const form = await reader.readForm();
      const file = form.file(key);
      return file ? file : null;
    }
    return null;
  }

}
