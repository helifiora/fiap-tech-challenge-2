import type { Environment } from "#utils/environment.ts";
import { BaseError, BaseErrorEnum } from "#domain/error.ts";
import * as v from "valibot";

export function parseEnv(value: unknown): Environment {
  try {
    const result = v.parse(EnvSchema, value);
    return {
      port: result.PORT,
      secret: result.SECRET,
      database: result.DATABASE,
    };
  } catch (e) {
    throw new EnvVariableError((e as any).message);
  }
}

const EnvSchema = v.object({
  PORT: v.pipe(
    v.string("Variável de ambiente 'PORT' deve ser definida"),
    v.minLength(1, "Variável de ambiente 'PORT' deve ser definida"),
    v.transform(Number),
    v.number("Variável 'PORT' deve ser um número"),
    v.integer("Variável 'PORT' deve ser um número inteiro"),
  ),
  SECRET: v.pipe(
    v.string("Variável de ambiente 'SECRET' deve ser definida"),
    v.minLength(1, "Variável de ambiente 'SECRET' deve ser definida"),
  ),
  DATABASE: v.pipe(
    v.string("Variável de ambiente 'DATABASE' deve ser definida"),
    v.minLength(1, "Variável de ambiente 'DATABASE' deve ser definida"),
  ),
});

export class EnvVariableError extends BaseError {
  constructor(message: string) {
    super(BaseErrorEnum.validation, message);
  }
}
