// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
  userId: string;
}

export class InternalError extends FullError {
  constructor() {
    super('InternalError');
    this.message = 'Internal error. Try again later';
    this.name = 'InternalError';
    this.code = '001';
    this.status = 500;
  }
}

export class MissingProcessPlatform extends FullError {
  constructor() {
    super('MissingProcessPlatform');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatform';
    this.code = '002';
    this.status = 400;
  }
}

export class UserDoesNotExist extends FullError {
  constructor(userId: string) {
    super('UserDoesNotExist');
    this.message = 'User does not exist';
    this.name = 'UserDoesNotExist';
    this.code = '003';
    this.status = 400;
    this.userId = userId;
  }
}

export class NotFoundError extends FullError {
  constructor(userId: string) {
    super('NotFoundError');
    this.message = 'Resource not found';
    this.name = 'NotFoundError';
    this.code = '004';
    this.status = 404;
    this.userId = userId;
  }
}

export class WrongType extends FullError {
  constructor(userId: string) {
    super('WrongType');
    this.message = 'Wrong type of data';
    this.name = 'WrongType';
    this.code = '005';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectCredentials extends FullError {
  constructor(userId: string, message?: string) {
    super('IncorrectCredentials');
    this.message = message ?? 'Incorrect credentials';
    this.name = 'IncorrectCredentials';
    this.code = '006';
    this.status = 401;
    this.userId = userId;
  }
}

export class UserAlreadyRegistered extends FullError {
  constructor(userId: string) {
    super('UserAlreadyRegistered');
    this.message = 'Email already registered';
    this.name = 'UserAlreadyRegistered';
    this.code = '007';
    this.status = 401;
    this.userId = userId;
  }
}

export class Unauthorized extends FullError {
  constructor() {
    super('Unauthorized');
    this.message = 'User not logged in';
    this.name = 'Unauthorized';
    this.code = '008';
    this.status = 401;
  }
}

export class WrongCategory extends FullError {
  constructor(userId: string) {
    super('WrongCategory');
    this.message = 'Wrong category of product';
    this.name = 'WrongCategory';
    this.code = '009';
    this.status = 400;
    this.userId = userId;
  }
}

export class InvalidType extends FullError {
  constructor(userId: string, target: string) {
    super('InvalidType');
    this.message = `Invalid type. Element ${target} has wrong type`;
    this.name = 'InvalidType';
    this.code = '010';
    this.status = 400;
    this.userId = userId;
  }
}

export class InvalidMongooseType extends FullError {
  constructor(userId: string, target: string) {
    super('InvalidMongooseType');
    this.message = `Invalid type. Element ${target} is not valid mongoDB id`;
    this.name = 'InvalidMongooseType';
    this.code = '011';
    this.status = 400;
    this.userId = userId;
  }
}

export class IncorrectLogin extends FullError {
  constructor(userId: string) {
    super('IncorrectLogin');
    this.message = 'Incorrect login or password';
    this.name = 'IncorrectLogin';
    this.code = '012';
    this.status = 400;
    this.userId = userId;
  }
}

export class UsernameAlreadyInUse extends FullError {
  constructor(userId: string) {
    super('UsernameAlreadyInUse');
    this.message = 'Selected username is already in use';
    this.name = 'UsernameAlreadyInUse';
    this.code = '007';
    this.status = 401;
    this.userId = userId;
  }
}
