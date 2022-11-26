import chalk from 'chalk';
import errLogger from './logger';
import * as enums from '../../enums';

export default class Log {
  static error(target: string, message: unknown): void {
    console.info(chalk.red(target));
    console.info(chalk.red(message));
    Log.saveLog(message, enums.ELogTypes.Error);
  }

  static warn(target: string, message: unknown): void {
    console.info(chalk.yellow(target));
    console.info(chalk.yellow(message));
    Log.saveLog(message, enums.ELogTypes.Warn);
  }

  static log(target: string, message: unknown): void {
    console.info(chalk.blue(target));
    console.info(chalk.blue(message));
    Log.saveLog(message, enums.ELogTypes.Log);
  }

  static trace(target: string, message: unknown): void {
    console.trace(chalk.yellowBright(target));
    console.info(chalk.yellowBright(message));
    Log.saveLog(message, enums.ELogTypes.Log);
  }

  private static saveLog(message: unknown, type: enums.ELogTypes): void {
    const mess = typeof message !== 'string' ? JSON.stringify(message) : message;

    if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_PROD) {
      return;
    }

    switch (type) {
      case enums.ELogTypes.Warn:
        errLogger.warn(mess);
        return;
      case enums.ELogTypes.Error:
        errLogger.error(mess);
        return;
      case enums.ELogTypes.Log:
      default:
        errLogger.info(mess);
        return;
    }
  }
}
