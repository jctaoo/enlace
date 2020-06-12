import { Reflect } from '../../third_party/Reflect.ts'

const METHOD_METADATA = 'method';
const PATH_METADATA = 'path';

const Controller = (path: string): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(PATH_METADATA, path, target);

    const bm = Reflect.getMetadata('design:paramtypes', target);
    if (bm) {
      console.log(bm[0] === Foo)
      console.log(bm)
    }
  }
}

const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value);
  }
}

const Get = createMappingDecorator('GET');
const Post = createMappingDecorator('POST');

function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance);

  const methodsNames = Object.getOwnPropertyNames(prototype);

  return methodsNames.map(methodName => {
    const fn = prototype[methodName];

    const route = Reflect.getMetadata(PATH_METADATA, fn);
    const method = Reflect.getMetadata(METHOD_METADATA, fn);
    
    return {
      route,
      method,
      fn,
      methodName
    }
  })
};

@Controller('/test')
class SomeClass {
  @Get('/a')
  someGetMethod() {
    return 'hello world';
  }

  @Post('/b')
  somePostMethod() {}
}

console.log(Reflect.getMetadata(PATH_METADATA, SomeClass)); // '/test'

console.log(mapRoute(new SomeClass()));


class Foo {
  constructor(name: string) {}
}
@Controller('')
class Bar {
  constructor(foo: Foo) {}
}