util = require('util')
assert = require('assert')

helpers = module.exports

# Alias for setTimeout that is CoffeeScript friendly
helpers.wait = (delay,fn) -> setTimeout(fn,delay)

# Is TTY
helpers.isTTY = ->
	return process.stdout?.isTTY is true and process.stderr?.isTTY is true

# Inspect
helpers.inspect = (obj, opts) ->
	# Prepare
	opts ?= {}

	# If the terminal supports colours, and the user hasn't set anything, then default to a sensible default
	if helpers.isTTY()
		opts.colors ?= '--no-colors' not in process.argv

	# If the terminal doesn't support colours, then over-write whatever the user set
	else
		opts.colors = false

	# Inspect and return
	if typeof obj is 'string'
		return obj
	else
		return util.inspect(obj, opts)

# Calling throwUnexpected will throw the unexpected error
helpers.throwUnexpected = ->
	throw new Error('this error is unexpected')

# Calling equal will perform an equal comparison on the arguments and will output the arguments if the comparison fails
helpers.equal = helpers.assertEqual = (argsActual, argsExpected, testName) ->
	try
		assert.equal(argsActual, argsExpected, testName)
	catch checkError
		process.stderr.write """
			------------------------------------
			Comparison Error:
			#{helpers.inspect(checkError.stack)}

			Comparison Input:
			#{helpers.inspect(argsActual)}

			Comparison Expected Input:
			#{helpers.inspect(argsExpected)}
			------------------------------------\n
			"""
		throw checkError

# Calling deepEqual will perform a deep equal comparison on the arguments and will output the arguments if the comparison fails
helpers.deepEqual = helpers.assertDeepEqual = (argsActual, argsExpected, testName) ->
	try
		assert.deepEqual(argsActual, argsExpected, testName)
	catch checkError
		process.stderr.write """
			------------------------------------
			\nComparison Error:
			#{helpers.inspect(checkError.stack)}

			Comparison Input:
			#{helpers.inspect(argsActual)}

			Comparison Expected Input:
			#{helpers.inspect(argsExpected)}
			------------------------------------\n
			"""
		throw checkError

# Calling errorEqual with the error  you expect will return a callback that will the arguments you expect to the callback's received arguments
# E.g. .done(errorEqual('the error message we expected'))
helpers.errorEqual = helpers.assertErrorEqual = (actualError, expectedError, testName) ->
	if expectedError
		if expectedError instanceof Error
			expectedErrorMessage = expectedError.message
		else
			expectedErrorMessage = expectedError
			expectedError = new Error(expectedErrorMessage)

	if actualError
		if actualError instanceof Error
			actualErrorMessage = actualError.message
		else
			actualErrorMessage = actualError
			actualError = new Error(actualErrorMessage)

	try
		if actualErrorMessage and expectedErrorMessage
			assert.ok(actualErrorMessage.indexOf(expectedErrorMessage) isnt -1, testName)
		else
			helpers.equal(actualError, expectedError, testName)

	catch checkError
		process.stderr.write """
			------------------------------------
			\nComparison Error:
			#{helpers.inspect(checkError.stack)}

			Comparison Input:
			#{helpers.inspect(inputError?.stack or inputError?.message or inputError)}

			Comparison Expected Input:
			#{helpers.inspect(actualErrorMessage)}
			------------------------------------\n
			"""
		throw checkError

	return null

# Calling this will return a callback that will return the argument that you passed this
# E.g. .addTask(returnViaCallback(5))
helpers.returnViaCallback = (result) ->
	->
		result

# Calling this will return a callback that will return the argument that you passed this
# E.g. .addTask(completeViaCallback(5, 100))
helpers.completeViaCallback = (result, delay=100) ->
	(complete) ->
		helpers.wait delay, -> complete(null, result)

helpers.returnErrorViaCallback = (message) ->
	->
		if message instanceof Error
			return message
		else
			return new Error(message)

# Calling this with the arguments you expect will return a callback that will the arguments you expect to the callback's received arguments
# E.g. .done(expectViaCallback('the expected results'))
helpers.expectViaCallback = (argsExpected...) ->
	(argsActual...) ->
		helpers.deepEqual(argsActual, argsExpected)

helpers.expectErrorViaCallback = (message, next) ->
	(inputError) ->
		try
			helpers.errorEqual(inputError, message)
		catch checkError
			if next?
				return next(checkError)
			else
				throw checkError
		return next?()
