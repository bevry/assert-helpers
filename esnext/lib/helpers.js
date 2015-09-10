/* eslint no-use-before-define:0 no-console:0 */
/**
Assert Helpers
This is not actually a class, but a necessary convention to get YUIdoc to document standalone items.
@class helpers
*/


// Import
const util = require('util')
const assert = require('assert')

/**
Alias for setTimeout with paramaters reversed
@private
@method wait
@static
@param {Number} delay Delay to send to setTimeout
@param {Function} fn Function to send to setTimeout
@return {Object} result of the setTimeout call
*/
function wait (delay, fn) {
	return setTimeout(fn, delay)
}

/**
Whether or not stdout and stderr are interactive
@private
@method isTTY
@static
@return {Boolean} Yes they are, or no they aren't.
*/
export function isTTY () {
	return process.stdout && process.stdout.isTTY === true && process.stderr && process.stderr.isTTY === true
}

/**
Return a stringified version of the value with indentation and colors where applicable
@method inspect
@static
@param {Mixed} value The value to inspect
@param {Object} [opts={}] The options to pass to util.inspect
@return {String} The inspected string of the value
*/
export function inspect (value, opts = {}) {
	// If the terminal supports colours, and the user hasn't set anything, then default to a sensible default
	if ( isTTY() && opts.colors == null ) {
		opts.colors = process.argv.indexOf('--no-colors') === -1
	}

	// If the terminal doesn't support colours, then over-write whatever the user set
	else {
		opts.colors = false
	}

	// Inspect and return
	if ( typeof value === 'string' ) {
		return value
	}
	else {
		return util.inspect(value, opts)
	}
}

/**
Log the inspected values of each of the arguments to stdout
@method log
@static
@param {Mixed} ...args The arguments to inspect and log
*/
export function log (...args) {
	for ( const arg of args ) {
		console.log(inspect(arg))
	}
}

/**
Output a comparison of the failed result to stderr
@private
@method logComparison
@static
@param {Mixed} actual The result data
@param {Mixed} expected The anticipated data
@param {Error|String} error The error instance or error message string to report
*/
export function logComparison (actual, expected, error) {
	process.stderr.write([
		'------------------------------------',
		'Comparison Error:',
		inspect(error.stack || error.message || error),
		'',
		'Comparison Actual:',
		inspect(actual),
		'',
		'Comparison Expected:',
		inspect(expected),
		'------------------------------------',
		''
	].join('\n'))
}


/**
Same as assert.equal in that it performs a strict equals check, but if a failure occurs it will output detailed information
@method equal
@static
@param {Mixed} actual The result data
@param {Mixed} expected The anticipated data
@param {String} [testName] The name of the test
@throws {Error} If the comparison failed, the failure will be thrown
*/
export function equal (actual, expected, testName) {
	try {
		assert.equal(actual, expected, testName)
	}
	catch ( checkError ) {
		logComparison(actual, expected, checkError)
		throw checkError
	}
}

/**
Same as assert.deepEQual in that it performs a deep equals check, but if a failure occurs it will output detailed information
@method deepEqual
@static
@param {Mixed} actual The result data
@param {Mixed} expected The anticipated data
@param {String} [testName] The name of the test
@throws {Error} If the comparison failed, the failure will be thrown
*/
export function deepEqual (actual, expected, testName) {
	try {
		assert.deepEqual(actual, expected, testName)
	}
	catch ( checkError ) {
		logComparison(actual, expected, checkError)
		throw checkError
	}
}

/**
Checks to see if the actual result contains the expected result
@method contains
@static
@param {Mixed} actual The result data
@param {Mixed} expected The anticipated data
@param {String} [testName] The name of the test
@throws {Error} If the comparison failed, the failure will be thrown
*/
export function contains (actual, expected, testName) {
	if ( testName == null )  testName = `Expected \`${actual}\` to contain \`${expected}\``
	assert.ok(actual.indexOf(expected) !== -1, testName)
}

/**
Checks to see if an error was as expected, if a failure occurs it will output detailed information
@method errorEqual
@static
@param {Error} actual The result error
@param {Error|String|Null} expected The anticipated error instance or message, can be null if you expect there to be no error
@param {String} [testName] The name of the test
@throws {Error} If the comparison failed, the failure will be thrown
*/
export function errorEqual (actualError, expectedError, testName) {
	let expectedErrorMessage, actualErrorMessage

	if ( expectedError ) {
		if ( expectedError instanceof Error ) {
			expectedErrorMessage = expectedError.message
		}
		else {
			expectedErrorMessage = expectedError
			expectedError = new Error(expectedErrorMessage)
		}
	}

	if ( actualError ) {
		if ( actualError instanceof Error ) {
			actualErrorMessage = actualError.message
		}
		else {
			actualErrorMessage = actualError
			actualError = new Error(actualErrorMessage)
		}
	}

	try {
		if ( actualErrorMessage && expectedErrorMessage ) {
			contains(actualErrorMessage, expectedErrorMessage, testName)
		}
		else {
			equal(actualError, expectedError || null, testName)
		}
	}

	catch ( checkError ) {
		logComparison(
			actualError && (actualError.stack || actualError.message || actualError),
			expectedErrorMessage,
			checkError
		)
		throw checkError
	}
}


/**
Generate a callback that will return the specified result
@method returnViaCallback
@static
@param {Mixed} result The result that the callback should return
@return {Function} The callback that will return the specified result
*/
export function returnViaCallback (result) {
	return function () {
		return result
	}
}

/**
Generate a callback that will receive a completion callback and call it with the specified result after the specified delay
@method completeViaCallback
@static
@param {Mixed} result The result that the callback should pass to the completion callback
@param {Number} [delay=100] The delay in milliseconds that we should wait before calling the completion callback
@return {Function} The callback that will provide the specified result
*/
export function completeViaCallback (result, delay = 100) {
	return function (complete) {
		wait(delay, function () {
			complete(null, result)
		})
	}
}

/**
Generate a callback that return an error instance with the specified message/error
@method returnErrorViaCallback
@static
@param {Error|String} [error='an error occured'] The error instance or message string that the callback will return
@return {Function} The callback that will return the specified result
*/
export function returnErrorViaCallback (error = 'an error occured') {
	return function () {
		if ( error instanceof Error ) {
			return error
		}
		else {
			return new Error(error)
		}
	}
}

/**
Generate a callback that throw an error instance with the specified message/error
@method throwErrorViaCallback
@static
@param {Error|String} [error='an error occured']  The error instance or message string that the callback will throw
@return {Function} The callback that will throw the specified error
*/
export function throwErrorViaCallback (error = 'an error occured') {
	return function () {
		if ( error instanceof Error ) {
			throw error
		}
		else {
			throw new Error(error)
		}
	}
}

/**
Generate a callback that will check the arguments it received with the arguments specified, if a failure occurs it will output detailed information
@method expectViaCallback
@static
@param {Mixed} ...argsExpected The arguments that we expect the callback to receive when it is called
@return {Function} The callback that will check the arguments it receives for the expected arguments
*/
export function expectViaCallback (...argsExpected) {
	return function (...argsActual) {
		deepEqual(argsActual, argsExpected)
	}
}


/**
Generate a callback that will check the error (if any) it receives for the expected error (if any), if a failure occurs it will output detailed information
@method expectErrorViaCallback
@static
@param {Mixed} error The error instance or message string that we expected, passed as the second argument to errorEqual
@param {Function} [next] An optional completion callback to call with the result of the compairson, if not specified and a failure occurs, the error will be thrown
@return {Function} The callback that will check the error (if any) it receives for the expected error (if any)
*/
export function expectErrorViaCallback (error, next) {
	return function (inputError) {
		try {
			errorEqual(inputError, error)
		}
		catch ( checkError ) {
			if ( next ) {
				next(checkError)
				return
			}
			else {
				throw checkError
			}
		}
		if ( next )  next()
	}
}
