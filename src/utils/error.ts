export enum BaseErrorEnum {
  validation = "validation",
  authentication = "authentication",
  authorization = "authorization",
}

export class BaseError extends Error {
  type: BaseErrorEnum;

  constructor(type: BaseErrorEnum, message: string) {
    super(message);
    this.type = type;
  }

  static isInstance(value: unknown): value is BaseError {
    return value instanceof BaseError;
  }
}
