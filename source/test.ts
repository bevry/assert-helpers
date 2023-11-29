// Import
import kava from 'kava'
import * as helpers from './index.js'
import { strictEqual } from 'assert'

// Don't confuse the tester
process.env.ASSERT_SILENCE = 'yes'
function fail() {
	console.error(new Error('a expected failure did not occur'))
	process.exit(1)
}

// Tests
kava.suite('assert-helpers', function (suite, test) {
	test('wait', function (done) {
		helpers.wait(0, done)
	})
	test('isTTY', function () {
		helpers.isTTY()
	})
	test('inspect', function () {
		process.env.COLORS = 'no'
		strictEqual(helpers.useColors(), false, 'colors should be disabled')
		strictEqual(helpers.inspect({ a: 1 }), '{ a: 1 }')
		process.env.COLORS = 'yes'
		strictEqual(helpers.useColors(), true, 'colors should be enabled')
		strictEqual(helpers.inspect({ a: 1 }), '{ a: \u001b[33m1\u001b[39m }')
	})
	// skip log
	// skip logComparison
	test('equal', function () {
		helpers.equal(1, 1)
		try {
			helpers.equal(1, 2)
			fail()
		} catch (err) {}
	})
	test('gte', function () {
		helpers.gte(2, 2)
		try {
			helpers.gte(1, 2)
			fail()
		} catch (err) {}
	})
	test('gt', function () {
		helpers.gt(3, 2)
		try {
			helpers.gt(2, 2)
			fail()
		} catch (err) {}
	})
	test('lte', function () {
		helpers.lte(2, 2)
		try {
			helpers.lte(2, 1)
			fail()
		} catch (err) {}
	})
	test('lt', function () {
		helpers.lt(2, 3)
		try {
			helpers.lt(2, 2)
			fail()
		} catch (err) {}
	})
	test('undef', function () {
		// @ts-ignore
		helpers.undef()
		try {
			helpers.undef(null)
			fail()
		} catch (err) {}
	})
	test('nullish', function () {
		// @ts-ignore
		helpers.nullish()
		helpers.nullish(null)
		try {
			helpers.nullish(false)
			fail()
		} catch (err) {}
	})
	test('deepEqual', function () {
		helpers.deepEqual({ a: 1 }, { a: 1 })
		try {
			helpers.deepEqual({ a: 1 }, { a: 2 })
			fail()
		} catch (err) {}
	})
	test('contains', function () {
		helpers.contains('ab', 'a')
		try {
			helpers.contains('ab', 'c')
			fail()
		} catch (err) {}
	})
	test('notContains', function () {
		helpers.notContains('ab', 'c')
		try {
			helpers.notContains('ab', 'a')
			fail()
		} catch (err) {}
	})
	test('errorEqual', function () {
		const a = new Error('abc')
		helpers.errorEqual(a, 'abc')
		try {
			helpers.errorEqual(a, 'xyz')
			fail()
		} catch (err) {}
	})
	test('returnViaCallback', function () {
		strictEqual(helpers.returnViaCallback('a')(), 'a')
	})
	test('completeViaCallback', function () {
		helpers.completeViaCallback(
			'a',
			0
		)(function (err, result) {
			strictEqual(err, null)
			strictEqual(result, 'a')
		})
	})
	test('errorViaCallback', function () {
		const a = new Error('abc')
		helpers.errorViaCallback(
			a,
			0
		)(function (err) {
			strictEqual(err, a)
		})
	})
	test('returnErrorViaCallback', function () {
		const a = new Error('abc')
		strictEqual(helpers.returnErrorViaCallback(a)(), a)
	})
	test('throwErrorViaCallback', function () {
		const a = new Error('abc')
		try {
			helpers.throwErrorViaCallback(a)()
		} catch (err) {
			strictEqual(err, a)
		}
	})
	test('expectErrorViaCallback', function () {
		const a = new Error('abc')
		helpers.expectErrorViaCallback(a)(a)
		try {
			helpers.expectErrorViaCallback(a)('xyz')
			fail()
		} catch (err) {}
	})
	test('expectThrowViaFunction', function () {
		const a = new Error('abc')
		helpers.expectThrowViaFunction(a, (): never => {
			throw a
		})
		try {
			helpers.expectThrowViaFunction(a, () => false as never)
		} catch (err) {}
	})
})
