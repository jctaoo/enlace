---
home: true
heroImage: /logo.png
heroText: Enlace
tagline: 🔗 一个通信框架
actionText: 上手!! →
actionLink: /guide/
features:
- title: 面向接口
  details: 您可以在Enlace中享受面向接口的所有好处, 轻易地扩展任何组件、降低应用程序的耦合度、让维护与调试变得简单...
- title: 为通信工作而不是HTTP
  details: 可以是Htpt,RPC,甚至可以是AppleWatch里的WatchConnectivity和任何自定义的通信,而不像其他框架一样以Http为中心
- title: 基于Deno和TypeScript
  details: Enlace基于Deno运行时与强大的TypeScript语言,我们计划在未来将Enlace带到更多平台上
footer: MIT Licensed | Copyright (c) 2020 jctaoo
---
# 😊 开始简单, 不失表达
```typescript
@MainApplication
class DemoApplication extends Application {

  @AddAdaptor(HttpAdaptor)
  onAddHttpAdaptor(adaptor: HttpAdaptor) {
    adaptor.router.useEndpointOn('/', () => 'HelloWorld');
  }

}
```

### 使用以下命令尝试该 Demo:
```bash
echo "{ \"compilerOptions\": { \"experimentalDecorators\": true, \"emitDecoratorMetadata\": true } }" >> ./tsconfig.json
deno run --allow-net --allow-read -c ./tsconfig.json https://raw.githubusercontent.com/2pown/enlace/develop/demo/simple.ts
```

<br/>
<br/>

# 🎉 贡献你的力量！
<div style="display: flex; justify-content: center; padding: 80px;">
    <span style="padding: 26px; flex: 1; display: flex; flex-direction: column; align-items: center;">
        <span>
            <img src="/github.png" style="height: 100px;"/>
        </span>
        <p style="text-align: center; font-size: 1.35rem">在 Github 上提交功能想法和错误问题，并且合并您的代码！</p>
        <span>
          <a href="https://github.com/2pown/enlace" target="_blank" class="action-button" style="
              display: inline-block;font-size: 1.2rem; color: #fff;
              background-color: #3eaf7c;padding: 0.8rem 1.6rem; border-radius: 4px;
              transition: background-color 0.1s ease;box-sizing: border-box;
              border-bottom: 1px solid #389d70;"
          >
            GitHub
          </a>
        </span>
    </span>
</div>

<br/>
<br/>
