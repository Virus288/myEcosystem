import type Broker from '../broker';
import type Router from '../router';
import type { IState } from '../types';

class State implements IState {
  private _broker: Broker;

  get broker(): Broker {
    return this._broker;
  }

  set broker(value: Broker) {
    this._broker = value;
  }

  private _router: Router;

  get router(): Router {
    return this._router;
  }

  set router(value: Router) {
    this._router = value;
  }
}

const state = new State();

export default state;
