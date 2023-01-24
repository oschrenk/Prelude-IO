import { Left, Right, Vector } from "prelude-ts";
import Bus from "./Bus";

/** An object containing metadata used to format errors */
export type IOError = {
  /** The condition (i.e, encoder or Predicate) that failed */
  condition: string;

  /** The value at time of failing. Should be the _specific_ type the condition was called with */
  value: unknown;

  /** Branches that caused the failure */
  branches?: IOErrors;
};

/** A vector of IOErrors */
export type IOErrors = Vector<IOError>;

/** Left-hand type for IOResult */
export type IOLeft = Left<IOErrors, unknown>;

/** Right-hand type for IOResult */
export type IORight<O> = Right<IOErrors, O>;

/** A shorthand return type for encoding functions */
export type IOResult<O = unknown> = IOLeft | IORight<O>;

/** A promisified return type for encoding functions */
export type IOPromise<O> = Promise<IOResult<O>>;

/** A (syncronous) decoding function, only used in initial declarations */
export type IODecode<I, O> = (input: I) => IOResult<O>;

/** A decoding function */
export type IOAsyncDecode<I, O> = (input: I) => IOPromise<O>;

/* eslint-disable @typescript-eslint/no-explicit-any */
/** Infers the input type of bus <B> */
export type BusInputType<B> = B extends Bus<infer Input, any> ? Input : never;

/** Infers the output type of bus <B> */
export type BusOutputType<B> = B extends Bus<any, infer O> ? O : never;

/** A shorthand type for the objects Complex busses are generated from */
export type ComplexFields = {
  [key: string]: Bus<any, any>;
};
/* eslint-enable */

/** A shorthand type for a Complex bus' input */
export type ComplexInput<F extends ComplexFields> = {
  [Field in keyof F]: BusInputType<F[Field]>;
};

/** A shorthand type for a Complex bus' output */
export type ComplexOutput<F extends ComplexFields> = {
  [Field in keyof F]: BusOutputType<F[Field]>;
};

/** A shorthand type for busses generated by the Complex preset */
export type ComplexBus<F extends ComplexFields> = Bus<
  ComplexInput<F>,
  ComplexOutput<F>
>;
