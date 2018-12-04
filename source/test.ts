// Import
import kava from 'kava'
import * as helpers from './'

// Tests
kava.suite('assert-helpers', function(suite, test) {
	test('node v' + process.versions.node, function() {
		console.log(__filename)
	})
})

// Ensure that the complation includes the helpers
export default helpers
