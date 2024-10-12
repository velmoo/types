import type { ToStr } from ".";

export type IsFloat<Num extends number> = ToStr<Num> extends `${string}.${string}` ? true : false;
