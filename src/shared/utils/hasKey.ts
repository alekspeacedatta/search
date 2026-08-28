import { isObject } from "./isObject";

export const hasKey =
  <K extends string, T>(key: K, value: (v: unknown) => v is T) =>
  (v: unknown): v is Record<K, T> =>
    isObject(v) && value(v[key]);