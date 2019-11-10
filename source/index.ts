'use strict'

// Import
import util from 'util'
import assert from 'assert'
import ansicolors from 'ansicolors'
import { diffJson, diffChars } from 'diff'

/** Type for a callback that receives an optional error as the first argument */
type Errback = (error?: Error) => void

/** Alias for setTimeout with paramaters reversed. */
export function wait(delay: number, fn: Function) {
	return setTimeout(fn, delay)
}

/** Whether or not we are running in the node environment */
export function isNode(): boolean {
	return Boolean(
		typeof process !== 'undefined' && process.versions && process.versions.node
	)
}

/** Whether or not stdout and stderr are interactive. */
export function isTTY(): boolean {
	return (
		isNode() &&
		process.stdout &&
		process.stdout.isTTY === true &&
		process.stderr &&
		process.stderr.isTTY === true
	)
}

/** Convert a value to its boolean equivalent */
export function bool(value: any): boolean | null {
	if (value === 'no' || value === 'false' || value === 'n' || value === 'N') {
		return false
	}
	if (value === 'null' || value === 'NULL') return null
	return Boolean(value)
}

/** Whether or not colors are desired on this environment */
export function useColors(): boolean {
	const env = isNode() && bool(process.env.COLOR || process.env.COLORS)
	if (typeof env === 'boolean') return env
	if (isTTY()) return true
	return (
		isNode() &&
		!process.argv.includes('--no-colors') &&
		!process.argv.includes('--no-color')
	)
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
 */
export function inspect(value: any, opts: NodeJS.InspectOptions = {}): string {
	// If the terminal supports colours, and the user hasn't specified, then default to a sensible default
	const colors = useColors()
	const depth = 50

	// Inspect and return using our defaults
	return util.inspect(value, { colors, depth, ...opts })
}

/** Return the difference between the new data and the old data. */
export function diff(newData: any, oldData: any) {
	// robust check for object, and try catch
	// to prevent https://github.com/bevry/assert-helpers/issues/5
	if (isObject(newData) && isObject(oldData)) {
		try {
			return diffJson(oldData, newData)
		} catch (err) {
			// continue
		}
	}
	// otherwise, continue with classical inspection
	const a = inspect(oldData, { colors: false })
	const b = inspect(newData, { colors: false })
	return diffChars(a, b)
}

/** Return a highlighted string of a difference. */
export function inspectDiffResult(d: ReturnType<typeof diff>): string {
	const colors = useColors()
	const result = d.reduce(function(accumulator, part) {
		let value = part.value
		if (colors) {
			if (part.added) {
				value =
					ansicolors.open.black +
					ansicolors.bgGreen(value) +
					ansicolors.open.green
			} else if (part.removed) {
				value =
					ansicolors.open.black +
					ansicolors.bgBrightRed(value) +
					ansicolors.open.green
			}
		}
		return accumulator + value
	}, '')
	return colors ? ansicolors.green(result) : result
}

/** Return the highlighted comparison between the new data and the old data. */
export function compare(newData: any, oldData: any) {
	return inspectDiffResult(diff(newData, oldData))
}

/** Alias for {@link compare} */
export function inpectDiff(newData: any, oldData: any) {
	return compare(newData, oldData)
}

/** Log the inspected values of each of the arguments to stdout */
export function log(...args: any): void {
	if (isNode() && process.env.ASSERT_SILENCE) return
	for (let i = 0; i < args.length; ++i) {
		console.log(inspect(args[i]))
	}
}

/** Output a comparison of the failed result to stderr */
export function logComparison(
	actual: any,
	expected: any,
	error: Error | string | any
): void {
	if (isNode() && process.env.ASSERT_SILENCE) return

	const lines = [
		'------------------------------------',
		'Comparison Error:',
		color(error.stack || error.message || error, ansicolors.green),
		''
	]

	lines.push('Comparison Diff:', compare(actual, expected), '')

	lines.push(
		'Comparison Actual:',
		inspect(actual),
		'',
		'Comparison Expected:',
		inspect(expected),
		'------------------------------------'
	)

	// Work for node
	if (isNode() && process.stderr) {
		process.stderr.write(lines.join('\n') + '\n')
	}
	// Work for browsers
	else {
		console.log(lines.join('\n'))
	}
}

/** Same as assert.strictEquals in that it performs a strict equals check, but if a failure occurs it will output detailed information */
export function equal(
	actual: any,
	expected: any,
	testName = 'equal assertion',
	next?: Errback
): void | never {
	try {
		assert.strictEqual(actual, expected, testName)
	} catch (checkError) {
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

/** Same as assert.deepStrictEqual in that it performs a deep strict equals check, but if a failure occurs it will output detailed information */
export function deepEqual(
	actual: any,
	expected: any,
	testName = 'deep equal assertion',
	next?: Errback
): void | never {
	try {
		assert.deepStrictEqual(actual, expected, testName)
	} catch (checkError) {
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
	next?: Errback
): void | never {
	if (testName == null)
		testName = `Expected [${actual}] to contain [${expected}]`
	try {
		assert.ok(actual.indexOf(expected) !== -1, testName)
	} catch (checkError) {
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
	next?: Errback
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
	} catch (checkError) {
		logComparison(
			actualError && (actualError.stack || actualError.message || actualError),
			expectedErrorMessage,
			checkError
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
	return function() {
		return value
	}
}

/** Generate a callback that will receive a completion callback whcih it will call with the specified result after the specified delay. */
/* eslint no-magic-numbers:0 */
export function completeViaCallback(value: any, delay = 100) {
	return function(complete: (error: null, result: typeof value) => void): void {
		wait(delay, function() {
			complete(null, value)
		})
	}
}

/** Generate a callback that will receive a completion callback which it will call with the passed error after the specified delay. */
/* eslint no-magic-numbers:0 */
export function errorViaCallback(error: Error | string, delay = 100) {
	return function(complete: (error: Error | string) => void): void {
		wait(delay, function() {
			complete(error)
		})
	}
}
/** Generate a callback that return an error instance with the specified message/error. */
export function returnErrorViaCallback(
	error: Error | string = 'an error occured'
) {
	return function(): Error {
		if (error instanceof Error) {
			return error
		} else {
			return new Error(error)
		}
	}
}

/** Generate a callback that throw an error instance with the specified message/error. */
export function throwErrorViaCallback(
	error: Error | string = 'an error occured'
) {
	return function(): never {
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
	next?: Errback
) {
	return (actual: Error | string) =>
		errorEqual(actual, expected, testName, next)
}

/** Expect the passed function to throw an error at some point. */
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
