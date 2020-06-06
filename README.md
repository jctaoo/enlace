# enlace is a server framework based on Deno.

⚠️Note: It's under development

# Simple Use:
simple.ts
```typescript
const HelloEndpoint = (input: HttpEndpointInput): string => {
  return `Hello World`;
};

const httpAdaptor = new HttpAdaptor();
httpAdaptor.router.use("/", HelloEndpoint);

const server = new EnlaceServer();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });
```
request
```shell
deno run --allow-net --allow-read ./simple.ts
curl http://localhost:20205/
```

# Endpoint:
`Endpoint` is the foundation of Enlace and has nothing to do with network protocol(like HTTP, WebSocket...). So `Endpoint` is divided into `NormalEndpoint` to reply to the client instantly and `KeepAliveEndpoint` to support long connection instead of HttpEndpoint and WebSocketEndpoint. To implement `Endpoint` for different network protocols, simply create a class that inherits from `NormalEndpoint` or `KeepAliveEndpoint`.

### Example code for defining the `Endpoint` for Http:
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
### Define a class based `Endpoint`:
```typescript
class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
```
### Define a function based `Endpoint`:
> note: The functional style of Endpoint does not support KeepAliveEndpoint well for the time being
```typescript
const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};
```
### Define a `KeepAliveEndpint`(Take WebSocket as an example):
```typescript
class ChatEndpoint extends WebSocketEndpoint {
  receive(input: WebSocketEndpointInput): void {
    console.log(`ws: ${input.body}`);
    this.broadcast(`welcome ${input.body}`)
  }
}
```
### Use `Endpoint` in Enalce:
Endpoint is very free to use in Enlace!!
```typescript
// type of endpoint class 
adaptor.router.use("/", SimpleEndpoint);
// endpoint instance (support custom construction parameters)
adaptor.router.use("/", new SimpleEndpoint());
// function
adaptor.router.use("/", FunctionEndpoint);
```

# Adaptor:
`Adaptor` helps Enlace use different network protocols. (`Adaptor` for Http and WebSocket built-in)
### Example code for defining the `Endpoint` for Http:
adaptor.ts
```typescript
class HttpAdaptor extends Adaptor {
  public router: Router = new Router(this);
  attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void { ... }
  public sendToClient(client: Client, content: any) { ... }
}
```
### Use `Adaptor` in Enlace:
```typescript 
const httpAdaptor = new HttpAdaptor();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });
```

# MiddleWare
comming soon...