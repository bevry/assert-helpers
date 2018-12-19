// Import
import kava from 'kava'
import * as helpers from './'
import ok from 'assert'

// Tests
kava.suite('assert-helpers', function(suite, test) {
	test('node v' + process.versions.node, function() {
		ok(helpers)
	})
})
