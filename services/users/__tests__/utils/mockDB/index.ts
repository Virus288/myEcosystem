import FakeUser from './user';

export default class Database {
  user: FakeUser;

  constructor() {
    this.user = new FakeUser();
  }

  async cleanUp(): Promise<void> {
    await this.user.cleanUp();
  }
}
