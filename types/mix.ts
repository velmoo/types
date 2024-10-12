import type {
  Obj,
  Arr,
  Stringable,
  Split,
  StrToInt,
  ExcludeIfStartsWith,
  ExtractIfStartsWith,
  AllowOtherStrings,
} from ".";

// ? SEPARATOR ? //

export type ToStr<Type extends Stringable> = `${Type}`;

export type ToNum<Type extends string | number | boolean> = Type extends number
  ? Type
  : Type extends true
    ? 1
    : Type extends false
      ? 0
      : Type extends `${infer Num extends number}`
        ? Num
        : never;

// ? SEPARATOR ? //

export type Prefix<Type extends Obj | Arr | string, Prefix extends string> = Type extends string
  ? `${Prefix}${Type}`
  : Type extends Obj
    ? {
        [Key in keyof Type as Key extends Stringable ? `${Prefix}${Key}` : never]: Type[Key];
      }
    : {
        [Index in keyof Type]: Type[Index] extends infer InferredType
          ? InferredType extends Stringable
            ? `${Prefix}${InferredType}`
            : never
          : never;
      };

export type UnPrefix<Type extends Obj | Arr | string, Prefix extends string> = Type extends string
  ? UnPrefixStr<Type, Prefix>
  : Type extends Obj
    ? {
        [Key in keyof Type as Key extends string ? UnPrefixStr<Key, Prefix> : Key]: Type[Key];
      }
    : {
        [Index in keyof Type]: Type[Index] extends string ? UnPrefixStr<Type[Index], Prefix> : Type[Index];
      };

type UnPrefixStr<Str extends string, Prefix extends string> = Str extends `${Prefix}${infer Rest}`
  ? Rest
  : Str;

export type Suffix<Type extends Obj | Arr | string, Suffix extends string> = Type extends string
  ? `${Type}${Suffix}`
  : Type extends Obj
    ? {
        [Key in keyof Type as Key extends Stringable ? `${Key}${Suffix}` : never]: Type[Key];
      }
    : {
        [Index in keyof Type]: Type[Index] extends infer InferredType
          ? InferredType extends Stringable
            ? `${InferredType}${Suffix}`
            : never
          : never;
      };

export type UnSuffix<Type extends Obj | Arr | string, Suffix extends string> = Type extends string
  ? UnSuffixStr<Type, Suffix>
  : Type extends Obj
    ? {
        [Key in keyof Type as Key extends string ? UnSuffixStr<Key, Suffix> : Key]: Type[Key];
      }
    : {
        [Index in keyof Type]: Type[Index] extends string ? UnSuffixStr<Type[Index], Suffix> : Type[Index];
      };

type UnSuffixStr<Str extends string, Suffix extends string> = Str extends `${infer Rest}${Suffix}`
  ? Rest
  : Str;

// ? SEPARATOR ? //

export type DeepKeyOf<
  Type extends Obj | Arr,
  Depth extends number = never,
  KeyToExtract extends AllowOtherStrings<_DeepKeyOf<Type, Depth, IncludeParents, IncludeArrayKeys>> = never,
  KeyToExclude extends AllowOtherStrings<
    ExtractIfStartsWith<
      _DeepKeyOf<Type, Depth, IncludeParents, IncludeArrayKeys>,
      [KeyToExtract] extends [never] ? "" : KeyToExtract
    >
  > = never,
  IncludeParents extends boolean = true,
  IncludeArrayKeys extends boolean = true,
> =
  _DeepKeyOf<Type, Depth, IncludeParents, IncludeArrayKeys> extends infer InferredDeepKey
    ? InferredDeepKey extends string
      ? ExtractIfStartsWith<
          ExcludeIfStartsWith<InferredDeepKey, [KeyToExclude] extends [never] ? never : KeyToExclude>,
          [KeyToExtract] extends [never] ? "" : KeyToExtract
        >
      : never
    : never;

type _DeepKeyOf<
  Type extends Obj | Arr,
  Depth extends number = never,
  IncludeParents extends boolean = true,
  IncludeArrayKeys extends boolean = true,
  _IncludeArrayItemType extends boolean = false,
  _Path extends string = "",
  _CurrDepth extends Arr = [],
> = _CurrDepth["length"] extends Depth
  ? never
  : {
        [Key in keyof Type]: Type[Key] extends infer InferredKey
          ? Key extends Stringable
            ? `${_Path}${Key}` extends infer NewPath
              ? NewPath extends string
                ? any[] extends InferredKey
                  ? _IncludeArrayItemType extends true
                    ? NewPath | `${NewPath}.-0`
                    : NewPath
                  : InferredKey extends Arr
                    ? IncludeArrayKeys extends true
                      ?
                          | NewPath
                          | _DeepKeyOf<
                              InferredKey,
                              Depth,
                              IncludeParents,
                              IncludeArrayKeys,
                              _IncludeArrayItemType,
                              `${NewPath}.`,
                              [..._CurrDepth, any]
                            >
                      : NewPath
                    : InferredKey extends Obj
                      ?
                          | (IncludeParents extends true ? NewPath : never)
                          | _DeepKeyOf<
                              InferredKey,
                              Depth,
                              IncludeParents,
                              IncludeArrayKeys,
                              _IncludeArrayItemType,
                              `${NewPath}.`,
                              [..._CurrDepth, any]
                            >
                      : NewPath
                : never
              : never
            : never
          : never;
      }[keyof Type] extends infer InferredRecursiveKeys
    ? Extract<InferredRecursiveKeys, string>
    : never;

export type GetDeep<
  ObjectType extends Obj | Arr,
  DeepKey extends _DeepKeyOf<ObjectType, never, true, true>,
> = DeepKey extends string
  ? Split<DeepKey, "."> extends infer Path
    ? Path extends Arr
      ? GetDeepByPath<ObjectType, Path>
      : never
    : never
  : never;

type GetDeepByPath<Type extends Obj | Arr, Path extends Arr> = Path extends [infer First, ...infer Rest]
  ? First extends keyof Type
    ? Type[First] extends infer InferredKey
      ? InferredKey extends Obj | Arr
        ? GetDeepByPath<InferredKey, Rest>
        : Rest["length"] extends 0
          ? InferredKey
          : never
      : never
    : First extends string
      ? StrToInt<First> extends infer InferredIndex
        ? InferredIndex extends number
          ? Type[InferredIndex]
          : never
        : never
      : never
  : Type;

// ? SEPARATOR ? //

export type NoOptional<Type extends Obj | Arr> = {
  [Key in keyof Type]-?: [Type[Key]];
} extends infer InferredObject
  ? InferredObject extends { [Key in keyof InferredObject]: [any] }
    ? { [Key in keyof InferredObject]: InferredObject[Key][0] }
    : never
  : never;

export type NoOptionalDeep<Type extends Obj | Arr> = NoOptional<{
  [Key in keyof Type]: Type[Key] extends infer InferredKey
    ? InferredKey extends Obj
      ? NoOptionalDeep<InferredKey>
      : InferredKey
    : never;
}>;
