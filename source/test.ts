// Import
import kava from 'kava'
import * as helpers from './'
import { ok, equal } from 'assert'

// Don't confuse the tester
process.env.ASSERT_SILENCE = 'yes'

// Tests
kava.suite('assert-helpers', function(suite, test) {
	test('wait', function(done) {
		helpers.wait(0, done)
	})
	test('isTTY', function() {
		helpers.isTTY()
	})
	test('inspect', function() {
		process.env.COLORS = 'no'
		equal(helpers.inspect({ a: 1 }), '{ a: 1 }')
		process.env.COLORS = 'yes'
		equal(helpers.inspect({ a: 1 }), '{ a: \u001b[33m1\u001b[39m }')
	})
	test('compare', function() {
		process.env.COLORS = 'no'
		equal(helpers.compare({ a: 1 }, { a: 2 }), `{\n  "a": 2\n  "a": 1\n}`)
		process.env.COLORS = 'yes'
		equal(
			helpers.compare({ a: 1 }, { a: 2 }),
			`\u001b[32m{\n\u001b[30m\u001b[101m  "a": 2\n\u001b[49m\u001b[32m\u001b[30m\u001b[42m  "a": 1\n\u001b[49m\u001b[32m}\u001b[39m`
		)
	})
	// skip log
	// skip logComparison
	test('equal', function() {
		helpers.equal(1, 1)
		try {
			helpers.equal(1, 2)
			ok(false)
		} catch (err) {}
	})
	test('deepEQual', function() {
		helpers.deepEqual({ a: 1 }, { a: 1 })
		try {
			helpers.deepEqual({ a: 1 }, { a: 2 })
			ok(false)
		} catch (err) {}
	})
	test('contains', function() {
		helpers.contains('ab', 'a')
		try {
			helpers.contains('ab', 'c')
			ok(false)
		} catch (err) {}
	})
	test('errorEqual', function() {
		const a = new Error('abc')
		helpers.errorEqual(a, 'abc')
		try {
			helpers.errorEqual(a, 'xyz')
			ok(false)
		} catch (err) {}
	})
	test('returnViaCallback', function() {
		equal(helpers.returnViaCallback('a')(), 'a')
	})
	test('completeViaCallback', function() {
		helpers.completeViaCallback(
			'a',
			0
		)(function(err, result) {
			equal(err, null)
			equal(result, 'a')
		})
	})
	test('errorViaCallback', function() {
		const a = new Error('abc')
		helpers.errorViaCallback(
			a,
			0
		)(function(err) {
			equal(err, a)
		})
	})
	test('returnErrorViaCallback', function() {
		const a = new Error('abc')
		equal(helpers.returnErrorViaCallback(a)(), a)
	})
	test('throwErrorViaCallback', function() {
		const a = new Error('abc')
		try {
			helpers.throwErrorViaCallback(a)()
		} catch (err) {
			equal(err, a)
		}
	})
	test('expectErrorViaCallback', function() {
		const a = new Error('abc')
		helpers.expectErrorViaCallback(a)(a)
		try {
			helpers.expectErrorViaCallback(a)('xyz')
			ok(false)
		} catch (err) {}
	})
	test('expectThrowViaFunction', function() {
		const a = new Error('abc')
		helpers.expectThrowViaFunction(a, (): never => {
			throw a
		})
		try {
			helpers.expectThrowViaFunction(a, () => false as never)
		} catch (err) {}
	})
})
