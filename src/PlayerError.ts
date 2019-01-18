import { ErrorCodes } from '@src/types';

export class PlayerError extends Error {
  public code: ErrorCodes;

  public underlyingError: any;

  constructor(code: ErrorCodes, error?: any) {
    super();

    this.code = code;

    this.underlyingError = error;
  }
}
