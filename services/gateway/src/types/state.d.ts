import Router from '../router';
import Broker from '../broker';

export interface IState {
  broker: Broker;
  router: Router;
}

export interface IConfigInterface {
  amqpURI: string;
  token: string;
  refToken: string;
  corsOrigin: string;
  httpPort: number;
}
