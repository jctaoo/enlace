# Enlace 是一个 [Deno](https://deno.land/) 平台的服务端框架

[English](README.md)

⚠️注意: Enlace 正在开发中

## 使用:
simple.ts
```typescript
const HelloEndpoint = (input: HttpEndpointInput): string => {
  return `Hello World`;
};

const httpAdaptor = new HttpAdaptor();
httpAdaptor.router.useEndpointOn("/", HelloEndpoint);

const server = new EnlaceServer();
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });
```
运行
```shell
deno run --allow-net --allow-read https://github.com/2pown/enlace/blob/develop/demo/simple_in_readme.ts
curl http://localhost:20205/
```

## Endpoint:
`Endpoint` 是 Enlace 的基础, 并且与网络协议(例如 Http 和 WebSocket)无关。所以 'Endpoint' 被分作 `NormalEndpoint` 和 `KeepAliveEndpoint` 而不是 HttpEndpoint 和 WebSocketEndpoint。 `NormalEndpoint` 支持再收到客户端请求后即时回复客户端，`KeepAliveEndpoint` 支持与客户端建立长连接。要为不同的网络协议实现 `Endpoint`，只需要简单地创建一个继承自 `NormalEndpoint` 或 `KeepAliveEndpoint` 的类即可。(Http 和 WebSocket 是内置的)

### 支持 Http 协议的 `Endpoint` 的示例代码:
endpoint.ts
```typescript
abstract class HttpEndpoint extends NormalEndpoint {
  abstract receive(input: HttpEndpointInput): any | Promise<any>;
}
```
input.ts
```typescript
class HttpEndpointInput implements EndpointInput {
  get url(): URL { ... }
  get method(): string { ... }
  get contentType(): string { ... }
  async json(): Promise<object | null> { ... }
  async fileFromForm(key: string): Promise<FormFile | null> { ... }
}
```
### 定义基于类的`Endpoint`:
```typescript
class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
```
### 定义基于函数的`Endpoint`:
> 注意: 函数风格的 Endpoint 暂时无法完全支持 KeepAliveEndpint。
```typescript
const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};
```
### 定义与客户端建立长连接的`Endpoint`(以 WebSocket 为例):
```typescript
class ChatEndpoint extends WebSocketEndpoint {
  receive(input: WebSocketEndpointInput): void {
    console.log(`ws: ${input.body}`);
    this.broadcast(`welcome ${input.body}`)
  }
}
```
### 在 Enlace 中使用 Endpoint:
Endpoint 的使用是十分自由的!!
```typescript
// 使用 Endpoint 类
adaptor.router.useEndpointOn("/", SimpleEndpoint);
// 使用 Endpoint 实例 (支持自定义的构造参数)
adaptor.router.useEndpointOn("/", new SimpleEndpoint());
// 函数
adaptor.router.useEndpointOn("/", FunctionEndpoint);
```

## Adaptor:
`Adaptor` 帮助 Enlace 使用不同的网络协议。(Http 和 WebSocket 是内置的)
### 支持 Http 协议的 `Adaptor` 的示例代码:
adaptor.ts
```typescript
class HttpAdaptor extends Adaptor {
  attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void { ... }
  public sendToClient(client: Client, content: any) { ... }
}
```
### 在 Enlace 中使用 `Adaptor`:
```typescript 
const httpAdaptor = new HttpAdaptor();
server.addAdaptorWithConfigure(httpAdaptor, { host: "localhost", port: 20205 });
```

## MiddleWare
稍后...

## 维护者

[@jctaoo](https://github.com/jctaoo).

## 使用许可

[MIT](LICENSE) © jctaoo