import { Application, EnlaceApplicationConfigure, isEnlaceApplicationConfigure } from '../core/application.ts';
import Log from '../util/log.ts';
import { EnlaceEnvironment } from '../core/envrionment.ts';
import { Constructor } from '../injector_type.ts';

// todo 不要引用 Constructor
export function MainApplication(configure: EnlaceApplicationConfigure): (target: Constructor<Application>) => void;
export function MainApplication(target: Constructor<Application>): void;
export function MainApplication(arg: any): any {
  const fn = (target: Constructor<Application>, configure?: EnlaceApplicationConfigure) => {
    console.clear();
    Log.info('starting enlace...');
    // todo check Application
    EnlaceEnvironment.shard.run(new target(configure));
  }
  if (isEnlaceApplicationConfigure(arg)) {
    return fn
  }
  fn(arg);
}