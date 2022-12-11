import State from './tools/state';
import errLogger from './tools/logger/logger';
import Log from './tools/logger/log';
import Broker from './broker';
import mongo from './tools/mongo';

class App {
  init(): void {
    const broker = new Broker();

    mongo()
      .then(() => {
        State.Broker = broker;
        return broker.init();
      })
      .catch((err) => {
        Log.log('Server', 'Err while initializing app');
        Log.log('Server', JSON.stringify(err));
        errLogger.error(err);
        errLogger.error(JSON.stringify(err));

        broker.close();
      });
  }
}

const app = new App();
app.init();
