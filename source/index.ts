'use strict'

// Import
import util from 'util'
import assert from 'assert'
import colors from 'ansicolors'
import diffUtil from 'diff'

type Errback = (error?: Error) => void

/** Alias for setTimeout with paramaters reversed. */
export function wait(delay: number, fn: Function) {
	return setTimeout(fn, delay)
}

/** Whether or not stdout and stderr are interactive. */
export function isTTY(): boolean {
	return (
		process.stdout &&
		process.stdout.isTTY === true &&
		process.stderr &&
		process.stderr.isTTY === true
	)
}

/**
 * Return a stringified version of the value with indentation and colors where applicable.
 * Colors will be applied if the environment supports it (--no-colors not present and TTY).
 */
export function inspect(value: any, opts: NodeJS.InspectOptions = {}): string {
	// If the terminal supports colours, and the user hasn't specified, then default to a sensible default
	const colors = isTTY() && process.argv.indexOf('--no-colors') === -1
	const depth = 50

	// Inspect and return using our defaults
	return util.inspect(value, { colors, depth, ...opts })
}

/** Return a highlighted string of a difference. */
export function inspectDiff(diff: diffUtil.IDiffResult[]): string {
	let result = ''
	diff.forEach(function(part) {
		let value = part.value
		if (part.added) {
			value = colors.open.black + colors.bgGreen(value) + colors.open.green
		} else if (part.removed) {
			value = colors.open.black + colors.bgBrightRed(value) + colors.open.green
		}
		result += value
	})
	return colors.green(result)
}

/** Return the difference between the new data and the old data. */
export function diff(newData: any, oldData: any) {
	if (typeof newData === 'object' && typeof oldData === 'object') {
		return diffUtil.diffJson(oldData, newData)
	} else {
		const a = inspect(oldData, { colors: false })
		const b = inspect(newData, { colors: false })
		return diffUtil.diffChars(a, b)
	}
}

/** Return a highlighted comparison between the new data and the old data. */
export function compare(newData: any, oldData: any) {
	return inspectDiff(diff(newData, oldData))
}

/** Log the inspected values of each of the arguments to stdout */
export function log(...args: any): void {
	for (let i = 0; i < args.length; ++i) {
		/* eslint no-console:0 */
		console.log(inspect(args[i]))
	}
}

/** Output a comparison of the failed result to stderr */
export function logComparison(
	actual: any,
	expected: any,
	error: Error | string | any
): void {
	const lines = [
		'------------------------------------',
		'Comparison Error:',
		colors.green(error.stack || error.message || error),
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
	if (process.stderr) {
		process.stderr.write(lines.join('\n') + '\n')
	}
	// Work for browsers
	else {
		console.log(lines.join('\n'))
	}
}

/** Same as assert.equal in that it performs a strict equals check, but if a failure occurs it will output detailed information */
export function equal(
	actual: any,
	expected: any,
	testName = 'equal assertion',
	next?: Errback
): void | never {
	try {
		assert.equal(actual, expected, testName)
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

/** Same as assert.deepEQual in that it performs a deep equals check, but if a failure occurs it will output detailed information */
export function deepEqual(
	actual: any,
	expected: any,
	testName = 'deep equal assertion',
	next?: Errback
): void | never {
	try {
		assert.deepEqual(actual, expected, testName)
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

/** Generate a callback that will receive a completion callback and call it with the specified result after the specified delay. */
/* eslint no-magic-numbers:0 */
export function completeViaCallback(value: any, delay = 100) {
	return function(complete: (error: null, result: typeof value) => void): void {
		wait(delay, function() {
			complete(null, value)
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

/** Generate a callback that will check the error (if any) it receives for the expected error (if any), if a failure occurs it will output detailed information. */
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

/** Deprecated. Use {@link expectErrorViaFunction} instead. */
export const expectErrorViaFunction = expectThrowViaFunction

/** Deprecated. Use {@link expectErrorViaFunction} instead. */
export const expectFunctionToThrow = expectThrowViaFunction
