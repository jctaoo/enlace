<div align="center">
  <img src="./docs/.vuepress/public/logo.png" width=200px height=200px/>
   <h1 align="center">Enlace</h1>
   <h2 align="center">基于Deno和Typescript处理连接的服务端框架</h2>
   <h5 align="center">⚠️Enlace正在开发中</h5>
</div>

<p align="center">
    <a href="https://www.typescriptlang.org/">
      <img src="https://img.shields.io/badge/TypeScript-%F0%9F%92%AA-blue?style=for-the-badge&logo=Typescript" alt="Typescript">
    </a>
    <a href="https://gitter.im/yeah2pown/Enlace?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge">
      <img src="https://img.shields.io/badge/Gitter-yeah2pown/Enlace-orange?style=for-the-badge&logo=gitter" alt="Gitter">
    </a> 
    <a href="https://deno.land/">
      <img src="https://img.shields.io/badge/platform-deno-black?style=for-the-badge&logo=deno" alt="Platform-Deno">
    </a> 
    <a href="https://github.com/2pown/enlace/blob/develop/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-red?style=for-the-badge" alt="Licence-MIT">
    </a> 
    <a href="https://www.codacy.com/gh/2pown/enlace?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=2pown/enlace&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/dc9bab23c5634fccba88b43c583e7850"/></a>
</p>

# TODO:
- [ ] 完成 CLI
- [ ] 完善 Http 与 WebSocket 的装饰器
- [ ] 完善函数式开发体验
- [ ] 自动扫描 Endpoint 与 Controller
- [ ] 完善 Vuepress 文档
- [ ] 编写单元测试

# Features:
- **面向接口**: 轻易地扩展任何组件、降低应用程序的耦合度、让维护与调试变得简单...
- **为通信工作而不是HTTP**: 可以是Http,RPC,甚至可以是任何自定义的通信,而不像其他框架一样以Http为中心
- **基于Deno和Typescript**: 基于Deno运行时与强大的Typescript语言,我们计划在未来将Enlace带到更多平台上

# Simple Usage:
simple.ts
```typescript
@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(router: Router) {
    router.useEndpointOn('/', () => 'HelloWorld');
  }

}
```
run
```bash
git clone https://github.com/2pown/enlace
cd enlace
deno run -c ./tsconfig.json --allow-net --allow-read ./demo/simple.ts
```

# 组成部分
- [EnlaceEnvrionment](#EnlaceEnvrionment): Enlace app 的运行环境，无需用户的配置和参与
- [Application](#Application): 承载了 Server 对象和依赖注入的 Injector 对象，是 enlace app 的核心
- [Server](#Server): 对请求进行处理的, 分配给某个 Adaptor 或者 Server 上的 Router 对象
- [Router](#Router): 完成对 Endpoint 与 Middleware 的调度
- [Adaptor](#Adaptor): 用于支持具体通信协议的适配器，Enlace 内置了 Http 与 WebSocket 的适配器
- [Middleware](#Middleware): 对请求进行过滤与加工，与 Endpoint 之前运行
- [Endpoint](#Endpoint): 外部请求进入 Enlace app 后的处理点
- Client: 用于唯一地标记每一次请求，由 Enlace 和 Adaptor 维护。
- EndpointInput: 统一的 Endpoint 输入。

# Envrionment
EnlaceEnvrionment 包含一个 Application，并根据 Application 里的配置来运行 Enlace app，以及自动地调用 Applicaiton 里定义的回调函数。(详见 [Application](#Application))

# Application:
Application 可以简单地任务是您对自己 app 的描述，其中里面包含了应用准备就绪后要做的事情，应用如何配置等的信息，而不承担开始监听端口，处理请求等的工作。

只需要定义继承自 Application 类，然后加上 @MainApplication 的注解，在运行该类所在的 ts 文件后后 EnlaceEnvrionment 就会自动调用。
### 应用启动的回调函数 `onStartUp`
当 enlace 完成准备工作可以正常接受请求的时候调用，示例代码:
```typescript
@MainApplication
class DemoApplication extends Application {
  onStartUp() {
    console.log("startup!!")
  }
  ...
}
```
### 用于配置 enlace 的回调函数 `configure`
在 `onStartUp` 之前调用，用于配置路由、中间件、依赖注入等，示例代码(省略了 DemoApplication 类的定义):
```typescript
configure(injector: Injector, server: EnlaceServer) {
  // 注入依赖
  injector.register(SomeClass);
  // 添加 HttpAdaptor 以支持对 Http 连接的处理
  server.addAdaptorWithConfigure(new HttpAdaptor(), { host: 'localhost', port: 20203 })
  // 对来自所有 adaptor 的所有路径的请求注册中间件
  server.router.useMiddlewareOn("*", (input, next) => {
    console.log("middleware");
    next();
  })
}
```
### 便利地添加 adaptor 的注解 `@AddAdaptor`
在 configure 回调里配置 adaptor 十分繁琐，而且添加不同的 adaptor 的操作极为通用，因此您可以方便地使用 @AddAdaptor 注解来完成该任务。

其中第一个参数为要添加的 adaptor 的构造器，即使该构造器有依赖（enlace 内置的依赖注入管理器会为你完成一切依赖的处理）；第二个参数为 adaptor 的配置（可选的，host 与 port）。

该注解标注的方法会在需要的 adaptor 添加成功后调用，因此您可以在该方法里进行路由的配置。

示例代码(省略了 DemoApplication 类的定义):
```typescript
@AddAdaptor(HttpAdaptor)
onAddHttpAdaptor(router: Router) {
  router.useEndpointOn('/', () => 'HelloWorld');
}
```

# Server
Server 记录了所有已经注册的 Adaptor 以及它们的配置信息。

当 Enlace app 启动时，Server 的 start 函数会被 EnlaceEnvrionment 自动调用，然后 Server 会调用每个注册了的 adaptor 上的 attachOnServer 函数以开始各个 adaptor 上的自定义的对端口监听等等行为。当收到来自 adaptor 的请求，Server 会将该请求分配到自己的 Rouer 或者对应 adaptor 的 Router 对象上。

> Server 会优先将请求与自己的 Router 对象相匹配，如果有匹配成功的，将不会调用在 adaptor 的 router 上注册的 Middleware 和 Endpoint

# Router
Router 记录了所有已经注册的 Endpoint 与 Middleware 以及它们各自的配置信息。Server 持有一个 Router 对象，每个 Adaptor 持有一个 Router 对象。

> 在 server 上的 router 注册的 Endpoint 没有明确划分使用哪个 Adaptor，因此您可以通过设置 EndpointConfig 中的 selectAdaptor 来动态确定需要该 Endpoint 接收来自哪个 adaptor 的数据。

当接收到来自 Server 的请求后，Router 会找出该请求符合要求的 Middleware 和 Endpoint，其中 Middleware 可以有多个，但 Endpoint 只有一个，然后对 Middleware 进行调用，接下来是 Endpoint。

Router 对象不需要用户手动创建，您只需要在你想要的 adaptor 上的 router 对象上注册您的 Middlewear 或者是 Endpoint。

# Adaptor
Adaptor 并不需要用户编写，而是由具体协议的实现者与 Enlace 的作者编写。目前 Enlace 里内置了 Http 和 WebSocket 的 Adaptor。

每个 Adaptor 都需要实现 Adaptor 抽象类，该抽象类定义如下：
```typescript
export abstract class Adaptor {
  // 每个 adaptor 需要手动维护每个连接与连接是的输入的关系，当某个连接不再有效时需要删除
  clientToInput: Map<Client, GenericEndpointInput> = new Map();

  // 定义该通信协议的初始化工作，比如对于 Http 来说就是监听端口
  attachOnServer(server: EnlaceServer, configure: AdaptorConfigure): void;

  // 定义如何将信息发送给客户端，可以在此处合理利用 clientToInput
  abstract sendToClient(client: Client, content: unknown): void;

  // 该字段的值由 Server 提供，只需要在收到请求后调用该函数，Server 就可以收到
  didReceiveContent: (input: GenericEndpointInput, client: Client) => void = () => { };
}
```
### Adaptor 的使用
您需要将您想在您的 app 中使用的通信协议告诉 Enlace，方法就是在在 Application 类中将具体的 Adaptor 实例注册到 Server 上(参见 [Application](#Application)):
```typescript
configure(injector: Injector, server: EnlaceServer) {
  // 添加 HttpAdaptor 以支持对 Http 连接的处理
  server.addAdaptorWithConfigure(new HttpAdaptor(), { host: 'localhost', port: 20203 })
}
// 或者
@AddAdaptor(HttpAdaptor, { host: 'localhost', port: 20203 })
onAddHttpAdaptor(router: Router) {
  // ......
}
```

# Middleware
对于 Middleware，没有什么特别的，有亮点需要注意的就是:

- 理论上 Middleware 执行的顺序应该是注册 Middleware 的顺序，但 Server 并不刻意维护 Middleware 的顺序，因此在编写 Middleware 时不应该假设自己的运行顺序(详情参见定义和扩展中间件指南)
- Middleware 于 Endpoint 之前运行

Middleware 的原型如下(被定义成只能用作函数形式是因为我们希望每个 Mddleware 足够简单，毕竟处理请求的主角是 Endpoint):
```typescript
type MiddleWare = (input: GenericEndpointInput, next: Function) => void | Promise<void>;
```
### Middleware 的使用
于 Endpoint 的使用基本相同，示例如下: 
```typescript
// 类定义，使用构造器
adaptor.router.useMiddlewareOn("/", MiddleWare);
```

# Endpoint
Endpoint 是一个具体处理外来请求的对象，原则上每个 Endpoint 定义
- 想要处理的请求是来自哪个 adaptor
- 请求 path 遵循的规则

然后 Server 会根据 adaptor 传入的请求数据对 Endpoint 进行调用。

值得注意的是，每个请求到最后只会有一个 Endpoint 处理。

> 具体通信协议的 adaptor、 endpoint 的接口以及 EndpointInput 中的内容均由具体通信协议的实现者提供，详情参见定义和扩展通信协议指南

### Endpoint 的抽象
由于 Enlace 的目标是处理通信而不是简单地处理 Http，因此合理地对处理请求的 Endpoint 对象进行抽象就显得至关重要，Enlace 需要赋予 Endpoint 处理各种通信的能力。

以两个比较常见的网络协议为例子:
1. **Http**: 这是一个 `半双工` 的网络协议，只需要处理外来请求，而不需要考虑主动地将信息传送到客户端，为此，Enlace 提供了 `NormalEndpoint`, `NormalEndpoint` 的定义如下:
```typescript
abstract class HttpEndpoint extends NormalEndpoint {
  abstract receive(input: HttpEndpointInput): any | Promise<any>;
}
```
2. **WebSocket**: 与 Http 不同，这是一个 `全双工` 的网络协议，需要处理主动像客户端推送信息的情况，为此，Enlace 提供了 `KeepAliveEndpint`, `KeepAliveEndpoint` 的定义如下:
```typescript
export abstract class KeepAliveEndpoint extends ClassEndpoint {
  clients: Client[];
  abstract receive(input: GenericEndpointInput): void;
  broadcast(message: unknown, clients: Client[]): void
  sendMessageToClient(message: unknown, client: Client): void
}
```
您可以使用 broadcast 和 sendMessageToClient 方法来对指定客户端主动推送信息。

其中，clients 代表当前连接在改端点上的连接，由实现具体网络协议的 adaptor 来维护，您只需要直接使用就好。

### 单个 Endpoint
Endpoint 的定义是多样的，您可以使用类的方式，也可以使用定义函数的方式。

下面是分别使用两种方式定义 Endpoint 的等效程序。

- **类**: 
```typescript
class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
```
- **函数**:
> 注意: 目前为止, 函数 Endpoint 并不能支持 KeepAliveEndpint 里的 sendMessageToClient 等方法。(我们已经将该目标添加到待办!)
```typescript
function(input: HttpEndpointInput): string {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};
```

### 一组 Endpoint --- `Controller`
总有些 Endpoint 之间会有些共同点，比如一组 Endpoint 用于支撑用户系统，一组 Endpoint 用于支撑支付系统。

因此，Enlace 提供了定义一组 Endpoint 的方式 --- `Controller`。

使用 `Controller` 需要使用 Typescript 的注解，示例如下:
```typescript
// TureFunction 是永远返回 True 的函数，此处说明该 Controller 接受来自所有 adaptor 的请求
// expectedPath 配置了该 Controller 所期望的请求路径，只有遵循 expectedPath 的请求才会进入该 Controller
@ControllerMapping({ expectedPath: "/", selectAdaptor: TrueFunction })
class HelloController {
  // 此处的 expectedPath 是基于 Controller 的 expectedPath 之上的，简单来说，这是相对路径而不是绝对路径
  // 对于 selectAdaptor， 只有当请求通过了 Controller 的 selectAdaptor，才会尝试通过 Controller 里标注了 Endpoint 的方法上的 selectAdaptor
  @Endpint({ expectedPath: "/hello", selectAdaptor: TrueFunction })
  hello(): string {
    return "Hello World"
  }
}
```

### 使用 Endpoint
单个 Endpoint 与 Controller 的使用完全相同，示例如下:
```typescript
// 类定义，使用构造器
adaptor.router.useEndpointOn("/", SimpleEndpoint);
// 类定义，使用实例
adaptor.router.useEndpointOn("/", new SimpleEndpoint());
// 函数式定义
adaptor.router.useEndpointOn("/", FunctionEndpoint);
// 使用 Controller
adaptor.router.useEndpointOn("/", new HelloController())
```

# 构建指南
comming soon...

# Maintainers

[@jctaoo](https://github.com/jctaoo).

# License

[MIT](LICENSE) © 2pown
