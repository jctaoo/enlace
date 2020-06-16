import { serve } from "https://deno.land/std/http/server.ts";
import {
  MultipartReader,
  isFormFile,
  FormFile,
} from "https://deno.land/std/mime/mod.ts";
import { path_to_url } from "../../lib/util/path_to_url.ts";
const s = serve({ port: 8000 });

const decoder = new TextDecoder("gb2312");
const encoder = new TextEncoder();

for await (const req of s) {
  // 获取url
  const url = path_to_url(req.proto, req.headers, req.url);
  console.log(url.href);
  // url.searchParams.forEach((value, key) => {
  //   console.log(`key: ${key} <=====> value: ${value}`);
  // });

  // 获取http 方法
  const method = req.method;
  console.log(method);

  // 获取body 类型
  const contentType = req.headers.get("content-type");

  // 传输二进制文件
  // console.log(contentType); // application/octet-stream
  // const body = await Deno.readAll(req.body); // Unit8Array
  // console.log(body.byteLength);

  // 传输raw: json | 文本 | js | html | xml | key-value
  console.log(contentType); // application/json; text/plain; application/javascript; text/html; application/xml; pplication/x-www-form-urlencoded
  const body = await Deno.readAll(req.body);
  const json = decoder.decode(body);
  console.log(json);

  // 传输form
  // console.log(conten tType);
  // const boundary = contentType!.match(/boundary=([^\s]+)/)![1];
  // console.log(boundary);
  // const reader = new MultipartReader(req.body, boundary);
  // const form = await reader.readForm();
  // const formValue = form.value('name');
  // const formFile = form.file('image');
  // console.log(formValue);
  // console.log(formFile?.size);

  req.respond({ body: "Hello" });
}
