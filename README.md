# enlace is a server framework based on Deno.

⚠️Note: It's under development

## Simple Use:
```typescript
const httpAdaptor = new HttpAdaptor();
server.addAdaptor(httpAdaptor, { host: "localhost", port: 20205 });

class SimpleEndpoint extends HttpEndpoint {
  receive(input: HttpEndpointInput): string {
    const name = input.query("name");
    return `Hello ${name}`;
  }
}
const endpoint = new SimpleEndpoint();

server.addEndpoint(
  endpoint,
  { expectedPath: "/", selectAdaptor: (adaptors) => adaptors[0] },
);
```