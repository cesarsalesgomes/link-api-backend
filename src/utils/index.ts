import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
  /**
   * Retorna data atual em UTC.
   *
   * @returns Date
   */
  getCurrentDate(): Date {
    return new Date(new Date().toUTCString());
  }
}
