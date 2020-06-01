# enlace is a server framework based on Deno.

⚠️Note: It's under development

## Simple Use:
```typescript
const httpAdaptor = new HttpAdaptor();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });
```

## Define a class based `Endpoint`
```typescript
class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
```

## Define a function based `Endpoint`
```typescript
const FunctionEndpoint = (input: HttpEndpointInput): string => {
  const name = input.query("name");
  return `functional endpoint name: ${name}`;
};
```

## Add `Endpoint` to server
```typescript
server.addEndpoint(
  new SimpleEndpoint(),
  { expectedPath: "/", selectAdaptor: (adaptors) => adaptors[0] },
);
server.addEndpoint(
  FunctionEndpoint,
  { expectedPath: "/functional", selectAdaptor: (adaptors) => adaptors[0] },
);
```

