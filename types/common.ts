export type Obj<T = unknown> = { [key: string]: T };

export type Arr = unknown[];

export type Valid = any;

export type Stringable = string | number | bigint | boolean | undefined | null;

export type Prettify<Type> = {
  [Key in keyof Type]: Type[Key];
} & {};

export type PrettifyDeep<Type> = {
  [Key in keyof Type]: Type[Key] extends infer InferredType
    ? InferredType extends Obj | Arr
      ? PrettifyDeep<InferredType>
      : InferredType
    : never;
} & {};
