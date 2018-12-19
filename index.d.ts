/// <reference types="node" />
/// <reference types="diff" />
declare module "index" {
    import * as diffUtil from 'diff';
    type Errback = (error?: Error) => void;
    /** Alias for setTimeout with paramaters reversed. */
    export function wait(delay: number, fn: Function): number;
    /** Whether or not we are running in the node environment */
    export function isNode(): boolean;
    /** Whether or not stdout and stderr are interactive. */
    export function isTTY(): boolean;
    /** Convert a value to its boolean equivalent */
    export function bool(value: any): boolean | null;
    /** Whether or not colors are desired on this environment */
    export function useColors(): boolean;
    /** Applies the color to the value if desired */
    export function color(value: any, color: Function): string;
    /**
     * Return a stringified version of the value with indentation and colors where applicable.
     * Colors will be applied if the environment supports it (--no-colors not present and TTY).
     */
    export function inspect(value: any, opts?: NodeJS.InspectOptions): string;
    /** Return a highlighted string of a difference. */
    export function inspectDiffResult(diff: diffUtil.IDiffResult[]): string;
    /** Return the difference between the new data and the old data. */
    export function diff(newData: any, oldData: any): diffUtil.IDiffResult[];
    /** Return the highlighted comparison between the new data and the old data. */
    export function compare(newData: any, oldData: any): string;
    /** Alias for {@link compare} */
    export function inpectDiff(newData: any, oldData: any): string;
    /** Log the inspected values of each of the arguments to stdout */
    export function log(...args: any): void;
    /** Output a comparison of the failed result to stderr */
    export function logComparison(actual: any, expected: any, error: Error | string | any): void;
    /** Same as assert.equal in that it performs a strict equals check, but if a failure occurs it will output detailed information */
    export function equal(actual: any, expected: any, testName?: string, next?: Errback): void | never;
    /** Same as assert.deepEQual in that it performs a deep equals check, but if a failure occurs it will output detailed information */
    export function deepEqual(actual: any, expected: any, testName?: string, next?: Errback): void | never;
    /** Checks to see if the actual result contains the expected result .*/
    export function contains(actual: any, expected: any, testName?: string, next?: Errback): void | never;
    /** Checks to see if an error was as expected, if a failure occurs it will output detailed information */
    export function errorEqual(actualError: any, expectedError: any, testName?: string, next?: Errback): void | never;
    /** Generate a callback that will return the specified value. */
    export function returnViaCallback(value: any): () => typeof value;
    /** Generate a callback that will receive a completion callback whcih it will call with the specified result after the specified delay. */
    export function completeViaCallback(value: any, delay?: number): (complete: (error: null, result: any) => void) => void;
    /** Generate a callback that will receive a completion callback which it will call with the passed error after the specified delay. */
    export function errorViaCallback(error: Error | string, delay?: number): (complete: (error: string | Error) => void) => void;
    /** Generate a callback that return an error instance with the specified message/error. */
    export function returnErrorViaCallback(error?: Error | string): () => Error;
    /** Generate a callback that throw an error instance with the specified message/error. */
    export function throwErrorViaCallback(error?: Error | string): () => never;
    /** Generate a callback that will check the arguments it received with the arguments specified, if a failure occurs it will output detailed information. */
    export function expectViaCallback(...expected: any): (...actual: any) => void;
    /**
     * Generate a callback that will check its error (the actual error) against the passed error (the expected error).
     * If a failure occurs it will output detailed information. */
    export function expectErrorViaCallback(expected: Error | string, testName?: string, next?: Errback): (actual: string | Error) => void;
    /** Expect the passed function to throw an error at some point. */
    export function expectThrowViaFunction(expected: Error | string, fn: () => never, testName?: string, next?: Errback): void;
    /** Deprecated. Use {@link expectErrorViaFunction} instead. */
    export const expectErrorViaFunction: typeof expectThrowViaFunction;
    /** Deprecated. Use {@link expectErrorViaFunction} instead. */
    export const expectFunctionToThrow: typeof expectThrowViaFunction;
}
declare module "test" { }
