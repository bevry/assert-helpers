/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

// Polyfill for older node versions
if (Array.prototype.includes == null) {
	// Array.prototype.includes missing on Node.js v4, first added in Node.js v6
	// eslint-disable-next-line no-extend-native
	Array.prototype.includes = function (searchElement) {
		return this.indexOf(searchElement) !== -1
	}
}
// String.prototype.includes included on Node.js v4

// Import
import {
	ok as _ok,
	strictEqual as _strictEqual,
	deepStrictEqual as _deepStrictEqual,
} from 'assert'
import { inspect as _inspect } from 'util'
import * as ansi from '@bevry/ansi'
import Errlop from 'errlop'
import { argv, env, stdout, stderr, versions } from 'process'

/** Type for a callback that receives an optional error as the first argument */
type Errback = (error?: Error) => void

/**
 * Alias for setTimeout with paramaters reversed.
 * @param delay - The delay in milliseconds before executing the function
 * @param fn - The function to execute after the delay
 * @returns The timer ID returned by setTimeout
 */
export function wait(delay: number, fn: (...args: any[]) => void) {
	return setTimeout(fn, delay)
}

/**
 * Whether or not we are running in the node environment
 * @returns True if running in Node.js, false otherwise
 */
export function isNode(): boolean {
	return Boolean(versions && versions.node)
}

/**
 * Whether or not stdout and stderr are interactive.
 * @returns True if both stdout and stderr are TTY, false otherwise
 */
export function isTTY(): boolean {
	return isNode() && stdout?.isTTY === true && stderr?.isTTY === true
}

/**
 * Convert a value to its boolean equivalent
 * @param value - The value to convert to boolean
 * @returns The boolean equivalent of the value, or null if undetermined
 */
export function bool(value: any): boolean | null {
	// node.js 15 apparently sets COLOR to 0 (is TTY) 1 (not TTY) https://github.com/bevry/assert-helpers/commit/593c40a7211f460532077e67a38a452b707b4f9c
	// however I was unable to reproduce in 2025 via console.log(process.env.COLOR) which outputs yes, which is what my shell env has set it to
	const string = String(value).toLowerCase()
	if (['no', 'n', 'false', '0'].includes(string)) {
		return false
	}
	if (['yes', 'y', 'true', '1'].includes(string)) {
		return true
	}
	// if (['null', ''].includes(string)) {
	// 		return null
	//}
	// otherwise, it's something unknown, discard
	return null
}

/**
 * Whether or not colors are desired on this environment
 * @returns True if colors should be used, false otherwise
 */
export function useColors(): boolean {
	// handle strong technical capability
	if (!isNode()) return false
	// disabled or enabled by strong user preference
	if (argv.includes('--no-colors') || argv.includes('--no-color')) return false
	if (argv.includes('--colors') || argv.includes('--color')) return false
	// @todo support [--[no-]color[s]=<truthy/falsey>] arguments
	// handle disabled by soft technical capability
	// if (!isTTY()) return false <-- despite this making sense, for some reason, the wide convention is for env vars to take preference over TTY detection, probably as many want colors when piping
	// handle soft user preference
	return bool(env.COLOR) ?? bool(env.COLORS) ?? isTTY()
}

/**
 * Applies the color to the value if desired
 * @param value - The value to colorize
 * @param color - The color function to apply
 * @returns The colorized string if colors are enabled, otherwise the string value
 */
export function color(value: any, color: (input: any) => string): string {
	return useColors() ? color(value) : String(value)
}

/**
 * Checks to see if a value is an object
 * https://github.com/bevry/typechecker/blob/69008d42927749d7e21cfe9816e478dd8d15ab88/source/index.js#L22-L30
 * @param value - The value to check
 * @returns True if the value is an object (but not null), false otherwise
 */
function isObject(value: any): boolean {
	// null is object, hence the extra check
	return value !== null && typeof value === 'object'
}

/**
 * Return a stringified version of the value with indentation and colors where applicable.
 * Colors will be applied if the environment supports it (--no-colors not present and TTY).
 * For the available options, refer to https://nodejs.org/dist/latest-v14.x/docs/api/util.html#util_util_inspect_object_options for Node.js
 * @param value - The value to inspect and stringify
 * @param opts - Additional options for the inspection
 * @returns The stringified and optionally colorized representation of the value
 */
export function inspect(value: any, opts: any = {}): string {
	// If the terminal supports colours, and the user hasn't specified, then default to a sensible default
	const colors = useColors()
	const depth = 50

	// Inspect and return using our defaults
	return _inspect(value, { colors, depth, ...opts })
}

/**
 * Log the inspected values of each of the arguments to stdout
 * @param args - The values to log
 */
export function log(...args: any): void {
	if (isNode() && env.ASSERT_SILENCE) return
	for (let i = 0; i < args.length; ++i) {
		console.log(inspect(args[i]))
	}
}

/**
 * Output a comparison of the failed result to stderr
 * @param actual - The actual value that was received
 * @param expected - The expected value
 * @param error - The error that occurred during comparison
 */
export function logComparison(
	actual: any,
	expected: any,
	error: Error | string | any
): void {
	if (isNode() && env.ASSERT_SILENCE) return

	const lines = [
		'------------------------------------',
		'Comparison Error:',
		color(error.stack || error.message || error, ansi.green),
		'',
	]

	lines.push(
		'Comparison Actual:',
		inspect(actual),
		'',
		'Comparison Expected:',
		inspect(expected),
		'------------------------------------'
	)

	// Work for node
	if (isNode() && stderr) {
		stderr.write(lines.join('\n') + '\n')
	}
	// Work for browsers
	else {
		console.log(lines.join('\n'))
	}
}

/**
 * Same as assert.strictEqual in that it performs a strict equals check, but if a failure occurs it will output detailed information
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function equal(
	actual: any,
	expected: any,
	testName = 'equal assertion',
	next?: Errback
): void | never {
	try {
		_strictEqual(actual, expected, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Is greater than or equal to
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function gte(
	actual: any,
	expected: any,
	testName = 'is greater than or equal to assertion',
	next?: Errback
): void | never {
	try {
		_strictEqual(actual >= expected, true, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Is less than or equal to
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function lte(
	actual: any,
	expected: any,
	testName = 'is less than or equal to assertion',
	next?: Errback
): void | never {
	try {
		_strictEqual(actual <= expected, true, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Is greater than
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function gt(
	actual: any,
	expected: any,
	testName = 'is greater than assertion',
	next?: Errback
): void | never {
	try {
		_strictEqual(actual > expected, true, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Is less than
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function lt(
	actual: any,
	expected: any,
	testName = 'is less than assertion',
	next?: Errback
): void | never {
	try {
		_strictEqual(actual < expected, true, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Ensure what is passed is undefined, otherwise fail and output what it is
 * @param actual - The actual value to check
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function undef(
	actual: any,
	testName = 'undef assertion',
	next?: Errback
) {
	try {
		_strictEqual(typeof actual, 'undefined', testName)
	} catch (checkError: any) {
		logComparison(actual, 'undefined', checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Ensure what is passed is undefined or null, otherwise fail and output what it is
 * @param actual - The actual value to check
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function nullish(
	actual: any,
	testName = 'nullish assertion',
	next?: Errback
) {
	try {
		_strictEqual(typeof actual, 'undefined', testName)
	} catch (e1: any) {
		try {
			_strictEqual(actual, null, testName)
		} catch (e2: any) {
			const error = new Errlop(e2, e1)
			logComparison(actual, 'nullish', error)
			if (next) {
				next(error)
				return
			} else {
				throw error
			}
		}
	}
	if (next) next()
}

/**
 * Same as assert.deepStrictEqual in that it performs a deep strict equals check, but if a failure occurs it will output detailed information
 * @param actual - The actual value to compare
 * @param expected - The expected value to compare against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function deepEqual(
	actual: any,
	expected: any,
	testName = 'deep equal assertion',
	next?: Errback
): void | never {
	try {
		_deepStrictEqual(actual, expected, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Checks to see if the actual result contains the expected result .
 * @param actual - The actual value to check for containment
 * @param expected - The expected value that should be contained
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function contains(
	actual: any,
	expected: any,
	testName = 'contains assertion',
	next?: Errback
): void | never {
	if (testName == null)
		testName = `Expected [${actual}] to contain [${expected}]`
	try {
		_ok(actual.includes(expected) === true, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Checks to see if the actual result does not contain the expected result .
 * @param actual - The actual value to check for non-containment
 * @param expected - The expected value that should not be contained
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function notContains(
	actual: any,
	expected: any,
	testName = 'does not contain assertion',
	next?: Errback
): void | never {
	if (testName == null)
		testName = `Expected [${actual}] to not contain [${expected}]`
	try {
		_ok(actual.includes(expected) === false, testName)
	} catch (checkError: any) {
		logComparison(actual, expected, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Checks to see if an error was as expected, if a failure occurs it will output detailed information
 * @param actualError - The actual error that was thrown
 * @param expectedError - The expected error to match against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function errorEqual(
	actualError: any,
	expectedError: any,
	testName = 'error equal assertion',
	next?: Errback
): void | never {
	try {
		// needs to work with errlop codes, hence usage of stack, as errlop tostring doesn't include code for now, unfortunately
		if (!actualError || !expectedError) {
			equal(actualError || '', expectedError || '', testName + ' (empty check)')
		} else if (actualError.code === (expectedError?.code || expectedError)) {
			equal(
				actualError.code,
				expectedError?.code || expectedError,
				testName + ' (.code check)'
			)
		} else {
			contains(
				actualError.toString(),
				expectedError.toString(),
				testName + ' (contains check)'
			)
		}
	} catch (checkError: any) {
		logComparison(actualError, expectedError, checkError)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/**
 * Generate a callback that will return the specified value.
 * @param value - The value to return from the callback
 * @returns A function that returns the specified value
 */
export function returnViaCallback(value: any): () => typeof value {
	return function () {
		return value
	}
}

/**
 * Generate a callback that will receive a completion callback whcih it will call with the specified result after the specified delay.
 * @param value - The value to pass to the completion callback
 * @param delay - The delay in milliseconds before calling the completion callback
 * @returns A function that takes a completion callback and calls it with the value after the delay
 */
export function completeViaCallback(value: any, delay = 100) {
	return function (
		complete: (error: null, result: typeof value) => void
	): void {
		wait(delay, function () {
			complete(null, value)
		})
	}
}

/**
 * Generate a callback that will receive a completion callback which it will call with the passed error after the specified delay.
 * @param error - The error to pass to the completion callback
 * @param delay - The delay in milliseconds before calling the completion callback
 * @returns A function that takes a completion callback and calls it with the error after the delay
 */
export function errorViaCallback(error: Error | string, delay = 100) {
	return function (complete: (error: Error | string) => void): void {
		wait(delay, function () {
			complete(error)
		})
	}
}

/**
 * Generate a callback that return an error instance with the specified message/error.
 * @param error - The error message or Error instance to return
 * @returns A function that returns an Error instance
 */
export function returnErrorViaCallback(
	error: Error | string = 'an error occurred'
) {
	return function (): Error {
		if (error instanceof Error) {
			return error
		} else {
			return new Error(error)
		}
	}
}

/**
 * Generate a callback that throw an error instance with the specified message/error.
 * @param error - The error message or Error instance to throw
 * @returns A function that throws an Error instance
 */
export function throwErrorViaCallback(
	error: Error | string = 'an error occurred'
) {
	return function (): never {
		if (error instanceof Error) {
			throw error
		} else {
			throw new Error(error)
		}
	}
}

/**
 * Generate a callback that will check the arguments it received with the arguments specified, if a failure occurs it will output detailed information.
 * @param expected - The expected arguments to compare against
 * @returns A function that compares received arguments with expected arguments
 */
export function expectViaCallback(...expected: any) {
	return (...actual: any) => deepEqual(actual, expected)
}

/**
 * Generate a callback that will check its error (the actual error) against the passed error (the expected error).
 * If a failure occurs it will output detailed information.
 * @param expected - The expected error to match against
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 * @returns A function that compares an actual error with the expected error
 */
export function expectErrorViaCallback(
	expected: Error | string,
	testName = 'expect error via callback assertion',
	next?: Errback
) {
	return (actual: Error | string) =>
		errorEqual(actual, expected, testName, next)
}

/**
 * Expect the passed function to throw an error at some point.
 * @param expected - The expected error to match against
 * @param fn - The function that should throw an error
 * @param testName - The name of the test for error reporting
 * @param next - Optional callback to call with any error
 */
export function expectThrowViaFunction(
	expected: Error | string,
	fn: () => never,
	testName = 'expect error via function assertion',
	next?: Errback
) {
	let actual = null
	try {
		fn()
	} catch (error) {
		actual = error
	}
	errorEqual(actual, expected, testName, next)
}

/** @deprecated Use {@link expectErrorViaFunction} instead */
export function expectErrorViaFunction(): never {
	throw new Error(
		'expectErrorViaFunction has been deprecated, use expectThrowViaFunction instead'
	)
}

/** @deprecated Use {@link expectErrorViaFunction} instead */
export function expectFunctionToThrow(): never {
	throw new Error(
		'expectFunctionToThrow has been deprecated, use expectThrowViaFunction instead'
	)
}
