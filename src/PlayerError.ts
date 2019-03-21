import { ErrorCodes, IPlayerError } from '@src/types';
import isString from 'lodash/isString';

export class PlayerError extends Error implements IPlayerError {
  public code: ErrorCodes;

  public underlyingError: any;

  constructor(input: ErrorCodes | string, error?: any) {
    super();

    if (isString(input)) {
      this.message = input;
    } else {
      this.code = input as ErrorCodes;
    }

    this.underlyingError = error;
  }
}
