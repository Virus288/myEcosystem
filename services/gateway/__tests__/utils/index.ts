import State from '../../src/tools/state';
import Broker from '../../src/broker';

export default class Utils {
  async init(): Promise<void> {
    return new Promise(async (resolve) => {
      State.broker = new Broker();
      await State.broker.init();
      setTimeout(() => {
        resolve();
      }, 4000);
    });
  }

  close(): void {
    State.broker.close();
  }
}
