# enlace is a server framework based on Deno.

⚠️Note: It's under development

## Simple Use:
```typescript
const httpAdaptor = new HttpAdaptor();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });
```

## Define a class based `Endpoint`:
```typescript
class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
```

## Define an async `Endpoint`: 
```typescript
class SimpleEndpoint extends HttpEndpoint {
  async receive(input: HttpEndpointInput): Promise<string> {
    const json = await input.json();
    if (json && 'name' in json) {
      const profile = json as { name: string };
      return `Hello ${profile.name}`;
    } else {
      return `wrong request`;
    }
  }
}
```

## Define a function based `Endpoint`:
```typescript
const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};
```

## Add `Endpoint` to server:
```typescript
// use class type
httpAdaptor.router.use("/", SimpleEndpoint);
// use class instance 
httpAdaptor.router.use("/", new SimpleEndpoint());
// use function
httpAdaptor.router.use("/functional", FunctionEndpoint);
// bind on root router. support custom select adaptor.
server.addEndpoint(FunctionEndpoint, { selectAdaptor: (e) => true, expectedPath: '/root-router' })
```

