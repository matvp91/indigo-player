import { ErrorCodes } from '@src/types';

export class PlayerError extends Error {
  public code: ErrorCodes;

  constructor(code: ErrorCodes) {
    super();

    this.code = code;
  }
}
