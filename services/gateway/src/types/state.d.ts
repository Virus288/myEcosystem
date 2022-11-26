import Router from '../router';
import Broker from '../broker';

export interface IState {
  Broker: Broker;
  Router: Router;
}

export interface IConfigInterface {
  amqpURI: string;
  token: string;
  refToken: string;
  corsOrigin: string;
  httpPort: number;
}
