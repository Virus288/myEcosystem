// eslint-disable-next-line max-classes-per-file
export class FullError extends Error {
  code = '000';
  status = 500;
  userId = undefined;
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

export class NotFoundError extends FullError {
  constructor() {
    super('NotFoundError');
    this.message = 'Resource not found';
    this.name = 'NotFoundError';
    this.code = '002';
    this.status = 404;
  }
}

export class Unauthorized extends FullError {
  constructor() {
    super('Unauthorized');
    this.message = 'User not logged in';
    this.name = 'Unauthorized';
    this.code = '003';
    this.status = 401;
  }
}

export class MissingProcessPlatform extends FullError {
  constructor() {
    super('MissingProcessPlatform');
    this.message = 'process.platform is missing';
    this.name = 'MissingProcessPlatform';
    this.code = '004';
    this.status = 400;
  }
}

export class NoDataProvided extends FullError {
  constructor(target: string) {
    super('NoDataProvided');
    this.message = `${target} not provided`;
    this.name = 'NoDataProvided';
    this.code = '005';
    this.status = 400;
  }
}
