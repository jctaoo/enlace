import { Application } from '../application.ts';
import Log from '../util/log.ts';
import { EnlaceEnvironment } from '../core/envrionment.ts';
import { Constructor } from '../injector_type.ts';

// todo 不要引用 Constructor
export const MainApplication = (target: Constructor<Application>) => {
  Log.info('starting enlace...');
  // todo check Application
  EnlaceEnvironment.shard.run(new target());
}