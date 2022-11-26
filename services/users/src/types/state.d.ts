import Broker from '../broker';

export interface IState {
  Broker: Broker;
}

export interface IConfigInterface {
  amqpURI: string;
  token: string;
  refToken: string;
}
