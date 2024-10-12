import type { IsFloat, StrToNum, ToStr } from "..";

export type Increment<Num extends number> =
  IsFloat<Num> extends true
    ? never
    : ToStr<Num> extends infer NumStr
      ? NumStr extends `-${infer PosNum extends number}`
        ? // @ts-expect-error
          StrToNum<`-${DecrementPosNumber<PosNum>}`>
        : NumStr extends `${infer PosNum extends number}`
          ? IncrementPosNum<PosNum>
          : never
      : never;

type IncrementPosNum<PosNum extends number, ARR extends any[] = []> = PosNum extends ARR["length"]
  ? [...ARR, any]["length"]
  : IncrementPosNum<PosNum, [...ARR, any]>;

type DecrementPosNumber<PosNum extends number, ARR extends any[] = []> = PosNum extends 0
  ? -1
  : PosNum extends ARR["length"]
    ? ARR extends [any, ...infer Rest]
      ? Rest["length"]
      : never
    : DecrementPosNumber<PosNum, [...ARR, any]>;
