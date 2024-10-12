import type { Arr, Stringable, JoinToStr } from ".";

export type Extract<Str extends string, Extracted extends Str> = Extracted;

export type ExtractIfIncludes<Str extends string, Includes extends AllowOtherStrings<Str>> = [
  Includes,
] extends [""]
  ? Str
  : Str extends `${string}${Includes}${string}`
    ? Str
    : never;

export type ExcludeIfIncludes<Str extends string, Includes extends AllowOtherStrings<Str>> = [
  Includes,
] extends [""]
  ? Str
  : Str extends `${string}${Includes}${string}`
    ? never
    : Str;

export type ExcludeIfStartsWith<Str extends string, Prefix extends AllowOtherStrings<Str>> = [
  Prefix,
] extends [""]
  ? Str
  : Str extends `${Prefix}${string}`
    ? never
    : Str;

export type ExcludeIfEndsWith<Str extends string, Suffix extends AllowOtherStrings<Str>> = [Suffix] extends [
  "",
]
  ? Str
  : Str extends `${string}${Suffix}`
    ? never
    : Str;

export type ExtractIfStartsWith<Str extends string, Prefix extends AllowOtherStrings<Str>> = [
  Prefix,
] extends [""]
  ? Str
  : Str extends `${Prefix}${string}`
    ? Str
    : never;

export type ExtractIfEndsWith<Str extends string, Suffix extends AllowOtherStrings<Str>> = [Suffix] extends [
  "",
]
  ? Str
  : Str extends `${string}${Suffix}`
    ? Str
    : never;

// ? SEPARATOR ? //

export type Split<
  Str extends string,
  Splitter extends AllowOtherStrings<"." | "_" | " " | "," | "|">,
> = Str extends `${infer Part1}${Splitter}${infer Part2}` ? [Part1, ...Split<Part2, Splitter>] : [Str];

// ? SEPARATOR ? //

export type AllowOtherStrings<T extends string> = T | (string & {});

export type IsEmptyOrZeros<Str extends string> = Str extends `${infer First}${infer Rest}`
  ? First extends "0"
    ? IsEmptyOrZeros<Rest>
    : false
  : true;

// ? SEPARATOR ? //

export type StrToNum<Str extends string> = (
  ValidateNumStr<Str> extends infer ValidStr
    ? ValidStr extends `${infer Left}.${infer Right}`
      ? IsEmptyOrZeros<Right> extends true
        ? Left
        : ValidStr
      : ValidStr
    : never
) extends infer InferredStr
  ? InferredStr extends `${infer Num extends number}`
    ? Num
    : never
  : never;

export type StrToInt<Str extends string> =
  StrToNum<Str> extends infer ValidNum
    ? ValidNum extends number
      ? `${ValidNum}` extends `${infer Left}.${infer Right}`
        ? never
        : ValidNum
      : never
    : never;

// ? SEPARATOR ? //

export type ValidateNumStr<Str extends string> = Str extends "."
  ? never
  : RemTrailingZeros<RemLeadingZeros<Str>> extends infer InferredStr
    ? InferredStr extends `${infer Left}.${infer Right}`
      ? Right extends "0"
        ? Left
        : InferredStr
      : InferredStr
    : never;

export type RemLeadingZeros<
  Str extends string,
  COUNT extends Arr = [],
> = Str extends `${infer First}${infer Rest}`
  ? First extends "0"
    ? Rest extends ""
      ? "0"
      : RemLeadingZeros<Rest, [...COUNT, any]>
    : First extends "-"
      ? COUNT["length"] extends 0
        ? `-${RemLeadingZeros<Rest, [...COUNT, any]>}`
        : never
      : First extends "."
        ? `0${Str}`
        : Str
  : Str;

export type RemTrailingZeros<
  Str extends string,
  MATCHED extends string = "",
  ZEROS extends Stringable[] = [],
  PASSED_DOT extends boolean = false,
> = (
  Str extends `${infer First}${infer Rest}`
    ? First extends "0"
      ? PASSED_DOT extends true
        ? RemTrailingZeros<Rest, MATCHED, [...ZEROS, "0"], PASSED_DOT>
        : RemTrailingZeros<Rest, `${MATCHED}0`, [], PASSED_DOT>
      : First extends "."
        ? RemTrailingZeros<Rest, `${MATCHED}${JoinToStr<ZEROS>}.`, [], true>
        : RemTrailingZeros<Rest, `${MATCHED}${JoinToStr<ZEROS>}${First}`, [], PASSED_DOT>
    : MATCHED extends ""
      ? ZEROS["length"] extends 0
        ? ""
        : "0"
      : MATCHED
) extends infer InferredStr
  ? InferredStr extends `${infer Left}.${infer Right}`
    ? Right extends ""
      ? `${InferredStr}0`
      : InferredStr
    : InferredStr extends ""
      ? "0"
      : InferredStr
  : never;
