import type { Stringable, Obj, Arr, GetDeep } from ".";

export type JoinToStr<
  Array extends Stringable[],
  Separator extends string = "",
  _String extends string = "",
  _IsFirstLoop extends boolean = true,
> = Array extends [infer First, ...infer Rest]
  ? First extends Stringable
    ? Rest extends Stringable[]
      ? JoinToStr<
          Rest,
          Separator,
          _IsFirstLoop extends true ? `${First}` : `${_String}${Separator}${First}`,
          false
        >
      : never
    : never
  : _String;

export type JoinToUnion<ArrType extends Arr> = ArrType[number];

// ? SEPARATOR ? //

export type DeepArrKeys<Type extends Obj | Arr, _Path extends string = ""> = {
  [Key in keyof Type]: Type[Key] extends infer InferredKey
    ? Key extends Stringable
      ? `${_Path}${Key}` extends infer NewPath
        ? NewPath extends string
          ? InferredKey extends Arr
            ? NewPath
            : InferredKey extends Obj
              ? DeepArrKeys<InferredKey, `${NewPath}.`>
              : never
          : never
        : never
      : never
    : never;
}[keyof Type] extends infer InferredKeys
  ? Extract<InferredKeys, string>
  : never;

export type Values<
  Type extends Obj | Arr,
  DeepArrKey extends DeepArrKeys<Type> | "" = "",
> = DeepArrKey extends ""
  ? Type[number]
  : DeepArrKey extends DeepArrKeys<Type>
    ? GetDeep<Type, DeepArrKey> extends infer InferredKey
      ? InferredKey extends Arr
        ? InferredKey[number]
        : never
      : never
    : never;

export type OptionalLast<
  Array extends unknown[],
  Count extends number = 1,
  _Counter extends any[] = [any],
  _OgArray extends unknown[] = Array,
> = Array extends [...infer StartItems, infer LastItem]
  ? _Counter["length"] extends _OgArray["length"] | Count
    ? [...StartItems, LastItem?]
    : [...OptionalLast<StartItems, Count, [..._Counter, any], _OgArray>, LastItem?]
  : Array;
