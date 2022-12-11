import Router from './router';
import State from './tools/state';
import errLogger from './tools/logger/logger';
import Log from './tools/logger/log';
import Broker from './broker';

export default class App {
  init(): void {
    const router = new Router();
    const broker = new Broker();

    try {
      State.router = router;
      State.broker = broker;
      router.init();
      broker.init();
    } catch (err) {
      Log.log('Server', 'Err while initializing app');
      Log.log('Server', JSON.stringify(err));
      errLogger.error(err);
      errLogger.error(JSON.stringify(err));

      router.close();
      broker.close();
    }
  }

  kill(): void {
    State.router.close();
    State.broker.close();
    Log.log('Server', 'Server closed');
  }
}

const app = new App();
app.init();
