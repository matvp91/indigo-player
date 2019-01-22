import { ErrorCodes, IPlayerError } from '@src/types';

export class PlayerError extends Error implements IPlayerError {
  public code: ErrorCodes;

  public underlyingError: any;

  constructor(code: ErrorCodes, error?: any) {
    super();

    this.code = code;

    this.underlyingError = error;
  }
}
