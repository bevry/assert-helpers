'use strict'

// Polyfill for older node versions
if (Array.prototype.includes == null) {
	// eslint-disable-next-line no-extend-native
	Array.prototype.includes = function (searchElement) {
		return this.indexOf(searchElement) !== -1
	}
}

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

/** Alias for setTimeout with paramaters reversed. */
export function wait(delay: number, fn: (...args: any[]) => void) {
	// @ts-ignore
	return setTimeout(fn, delay)
}

/** Whether or not we are running in the node environment */
export function isNode(): boolean {
	return Boolean(versions && versions.node)
}

/** Whether or not stdout and stderr are interactive. */
export function isTTY(): boolean {
	return (
		isNode() &&
		stdout &&
		stdout.isTTY === true &&
		stderr &&
		stderr.isTTY === true
	)
}

/** Convert a value to its boolean equivalent */
export function bool(value: any): boolean | null {
	if (value === 'no' || value === 'false' || value === 'n' || value === 'N') {
		return false
	}
	if (value == null || value === '' || value === 'null' || value === 'NULL')
		return null
	// node.js 15 compatibility
	// which sets COLOR to 0 (is TTY) 1 (not TTY)
	// which is the opposite of what one would reasonable expect
	// so ignore such pollution, such that decision is determined by another factor
	if (value === '0') return null
	if (value === '1') return null
	// return boolean version
	return Boolean(value)
}

/** Whether or not colors are desired on this environment */
export function useColors(): boolean {
	// if unsupported, return false
	if (!isNode()) return false
	// if disabled, return false
	if (argv.includes('--no-colors') || argv.includes('--no-color')) return false
	// if unspecified, use default (tty)
	return bool(env.COLOR) ?? bool(env.COLORS) ?? isTTY()
}

/** Applies the color to the value if desired */
export function color(value: any, color: Function): string {
	return useColors() ? color(value) : value
}

/**
 * Checks to see if a value is an object
 * https://github.com/bevry/typechecker/blob/69008d42927749d7e21cfe9816e478dd8d15ab88/source/index.js#L22-L30
 */
function isObject(value: any): boolean {
	// null is object, hence the extra check
	return value !== null && typeof value === 'object'
}

/**
 * Return a stringified version of the value with indentation and colors where applicable.
 * Colors will be applied if the environment supports it (--no-colors not present and TTY).
 * For the available options, refer to https://nodejs.org/dist/latest-v14.x/docs/api/util.html#util_util_inspect_object_options for Node.js
 */
export function inspect(value: any, opts: any = {}): string {
	// If the terminal supports colours, and the user hasn't specified, then default to a sensible default
	const colors = useColors()
	const depth = 50

	// Inspect and return using our defaults
	return _inspect(value, { colors, depth, ...opts })
}

/** Log the inspected values of each of the arguments to stdout */
export function log(...args: any): void {
	if (isNode() && env.ASSERT_SILENCE) return
	for (let i = 0; i < args.length; ++i) {
		console.log(inspect(args[i]))
	}
}

/** Output a comparison of the failed result to stderr */
export function logComparison(
	actual: any,
	expected: any,
	error: Error | string | any,
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
		'------------------------------------',
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

/** Same as assert.strictEqual in that it performs a strict equals check, but if a failure occurs it will output detailed information */
export function equal(
	actual: any,
	expected: any,
	testName = 'equal assertion',
	next?: Errback,
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

/** Is greater than or equal to */
export function gte(
	actual: any,
	expected: any,
	testName = 'is greater than or equal to assertion',
	next?: Errback,
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

/** Is less than or equal to */
export function lte(
	actual: any,
	expected: any,
	testName = 'is less than or equal to assertion',
	next?: Errback,
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

/** Is greater than */
export function gt(
	actual: any,
	expected: any,
	testName = 'is greater than assertion',
	next?: Errback,
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

/** Is less than */
export function lt(
	actual: any,
	expected: any,
	testName = 'is less than assertion',
	next?: Errback,
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

/** Ensure what is passed is undefined, otherwise fail and output what it is */
export function undef(
	actual: any,
	testName = 'undef assertion',
	next?: Errback,
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

/** Ensure what is passed is undefined or null, otherwise fail and output what it is */
export function nullish(
	actual: any,
	testName = 'nullish assertion',
	next?: Errback,
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

/** Same as assert.deepStrictEqual in that it performs a deep strict equals check, but if a failure occurs it will output detailed information */
export function deepEqual(
	actual: any,
	expected: any,
	testName = 'deep equal assertion',
	next?: Errback,
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

/** Checks to see if the actual result contains the expected result .*/
export function contains(
	actual: any,
	expected: any,
	testName = 'contains assertion',
	next?: Errback,
): void | never {
	if (testName == null)
		testName = `Expected [${actual}] to contain [${expected}]`
	try {
		_ok(actual.indexOf(expected) !== -1, testName)
	} catch (checkError: any) {
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/** Checks to see if an error was as expected, if a failure occurs it will output detailed information */
export function errorEqual(
	actualError: any,
	expectedError: any,
	testName = 'error equal assertion',
	next?: Errback,
): void | never {
	let expectedErrorMessage, actualErrorMessage

	if (expectedError) {
		if (expectedError instanceof Error) {
			expectedErrorMessage = expectedError.message
		} else {
			expectedErrorMessage = expectedError
			expectedError = new Error(expectedErrorMessage)
		}
	}

	if (actualError) {
		if (actualError instanceof Error) {
			actualErrorMessage = actualError.message
		} else {
			actualErrorMessage = actualError
			actualError = new Error(actualErrorMessage)
		}
	}

	try {
		if (actualErrorMessage && expectedErrorMessage) {
			contains(actualErrorMessage, expectedErrorMessage, testName)
		} else {
			equal(actualError, expectedError || null, testName)
		}
	} catch (checkError: any) {
		logComparison(
			actualError && (actualError.stack || actualError.message || actualError),
			expectedErrorMessage,
			checkError,
		)
		if (next) {
			next(checkError)
			return
		} else {
			throw checkError
		}
	}
	if (next) next()
}

/** Generate a callback that will return the specified value. */
export function returnViaCallback(value: any): () => typeof value {
	return function () {
		return value
	}
}

/** Generate a callback that will receive a completion callback whcih it will call with the specified result after the specified delay. */
/* eslint no-magic-numbers:0 */
export function completeViaCallback(value: any, delay = 100) {
	return function (
		complete: (error: null, result: typeof value) => void,
	): void {
		wait(delay, function () {
			complete(null, value)
		})
	}
}

/** Generate a callback that will receive a completion callback which it will call with the passed error after the specified delay. */
/* eslint no-magic-numbers:0 */
export function errorViaCallback(error: Error | string, delay = 100) {
	return function (complete: (error: Error | string) => void): void {
		wait(delay, function () {
			complete(error)
		})
	}
}
/** Generate a callback that return an error instance with the specified message/error. */
export function returnErrorViaCallback(
	error: Error | string = 'an error occurred',
) {
	return function (): Error {
		if (error instanceof Error) {
			return error
		} else {
			return new Error(error)
		}
	}
}

/** Generate a callback that throw an error instance with the specified message/error. */
export function throwErrorViaCallback(
	error: Error | string = 'an error occurred',
) {
	return function (): never {
		if (error instanceof Error) {
			throw error
		} else {
			throw new Error(error)
		}
	}
}

/** Generate a callback that will check the arguments it received with the arguments specified, if a failure occurs it will output detailed information. */
export function expectViaCallback(...expected: any) {
	return (...actual: any) => deepEqual(actual, expected)
}

/**
 * Generate a callback that will check its error (the actual error) against the passed error (the expected error).
 * If a failure occurs it will output detailed information. */
export function expectErrorViaCallback(
	expected: Error | string,
	testName = 'expect error via callback assertion',
	next?: Errback,
) {
	return (actual: Error | string) =>
		errorEqual(actual, expected, testName, next)
}

/** Expect the passed function to throw an error at some point. */
export function expectThrowViaFunction(
	expected: Error | string,
	fn: () => never,
	testName = 'expect error via function assertion',
	next?: Errback,
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
		'expectErrorViaFunction has been deprecated, use expectThrowViaFunction instead',
	)
}

/** @deprecated Use {@link expectErrorViaFunction} instead */
export function expectFunctionToThrow(): never {
	throw new Error(
		'expectFunctionToThrow has been deprecated, use expectThrowViaFunction instead',
	)
}
