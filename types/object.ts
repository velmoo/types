import type { Obj, PrettifyDeep, Stringable, DeepKeyOf, Prettify, GetDeep } from ".";

// ? SEPARATOR ? //

export type ReplaceType<
  Object extends { [Key: string]: unknown },
  TargetKey extends keyof Object,
  NewType = Object[TargetKey],
> = Omit<Object, TargetKey> & {
  [UNUSED in any as TargetKey]: NewType;
} extends infer FinalType
  ? Prettify<FinalType>
  : never;

export type ReplaceTypeDeep<
  Object extends Obj,
  TargetKey extends DeepKeyOf<Object>,
  NewType = GetDeep<Object, TargetKey>,
  _DeepKey extends string = "",
> = {
  [Key in keyof Object]: Key extends string
    ? (_DeepKey extends "" ? Key : `${_DeepKey}.${Key}`) extends infer NewDeepKey
      ? TargetKey extends NewDeepKey
        ? NewType
        : Object[Key] extends infer InferredKey
          ? InferredKey extends Obj
            ? NewDeepKey extends string
              ? ReplaceTypeDeep<InferredKey, TargetKey, NewType, NewDeepKey>
              : never
            : InferredKey
          : never
      : never
    : Object[Key];
} extends infer FinalType
  ? Prettify<FinalType>
  : never;

// ? SEPARATOR ? //

export type PartialDeep<
  Object extends Obj,
  KeyToExclude extends DeepKeyOf<Object> | null = null,
  _DeepKey extends string = "",
> = {
  [Key in keyof Object as _DeepKey extends ""
    ? Key extends KeyToExclude
      ? never
      : Key
    : Key extends Stringable
      ? `${_DeepKey}.${Key}` extends KeyToExclude
        ? never
        : Key
      : never]?: Object[Key] extends infer InferredKey
    ? InferredKey extends Obj
      ? PartialDeep<
          InferredKey,
          KeyToExclude,
          Key extends string ? (_DeepKey extends "" ? Key : `${_DeepKey}.${Key}`) : never
        >
      : InferredKey
    : never;
} & {
  [Key in keyof Object as _DeepKey extends ""
    ? Key extends KeyToExclude
      ? Key
      : never
    : Key extends Stringable
      ? `${_DeepKey}.${Key}` extends KeyToExclude
        ? Key
        : never
      : never]: Object[Key] extends infer InferredKey
    ? InferredKey extends Obj
      ? PartialDeep<
          InferredKey,
          KeyToExclude,
          Key extends string ? (_DeepKey extends "" ? Key : `${_DeepKey}.${Key}`) : never
        >
      : InferredKey
    : never;
} extends infer InferredObject
  ? InferredObject extends Obj
    ? PrettifyDeep<InferredObject>
    : never
  : never;

// ? SEPARATOR ? //

/**
 * Merge keys deeply
 */

export type OverrideMerge<Objects extends Obj[], _FinalObject extends Obj = {}> = Objects extends [
  infer First,
  ...infer Rest,
]
  ? Omit<_FinalObject, keyof First> & First extends infer NewFinalObject
    ? NewFinalObject extends Obj
      ? Rest["length"] extends 0
        ? PrettifyDeep<NewFinalObject>
        : Rest extends Obj[]
          ? OverrideMerge<Rest, NewFinalObject>
          : never
      : never
    : never
  : never;

/**
 * Only merge new keys
 */

export type PreserveMerge<Objects extends Obj[], _FinalObject extends Obj = {}> = Objects extends [
  infer First,
  ...infer Rest,
]
  ? Omit<First, keyof _FinalObject> & _FinalObject extends infer NewFinalObject
    ? NewFinalObject extends Obj
      ? Rest["length"] extends 0
        ? Prettify<NewFinalObject>
        : Rest extends Obj[]
          ? PreserveMerge<Rest, NewFinalObject>
          : never
      : never
    : never
  : never;

/**
 * Only merge new keys (deeply)
 */

export type PreserveMergeDeep<Objects extends Obj[], _FinalObject extends Obj = {}> = (
  Objects extends [infer First, ...infer Rest]
    ? {
        [Key in keyof First]: Key extends keyof _FinalObject
          ? _FinalObject[Key] extends Obj
            ? First[Key] extends Obj
              ? PreserveMergeDeep<[_FinalObject[Key], First[Key]]>
              : never
            : never
          : First[Key];
      } & _FinalObject extends infer _NewFinalObject
      ? _NewFinalObject extends Obj
        ? Rest["length"] extends 0
          ? _NewFinalObject
          : Rest extends Obj[]
            ? PreserveMergeDeep<Rest, _NewFinalObject>
            : never
        : never
      : never
    : never
) extends infer FinalType
  ? PrettifyDeep<FinalType>
  : never;

// ? SEPARATOR ? //

export type StrictOmit<Object extends Obj, Keys extends keyof Object> = Pick<
  Object,
  Exclude<keyof Object, Keys>
>;
