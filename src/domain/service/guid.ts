import { randomUUID } from "node:crypto";

export function createGuid(): string {
  return randomUUID();
}
