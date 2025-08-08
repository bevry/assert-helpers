// Import
import kava from 'kava'
import * as helpers from './index.js'
import { strictEqual } from 'assert'
import { exit, env } from 'process'

// Don't confuse the tester
env.ASSERT_SILENCE = 'yes'
/**
 *
 */
function fail() {
	console.error(new Error('a expected failure did not occur'))
	exit(1)
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
		// don't test defaults, as env vars and tty capabilities change based on the environment
		// in the following tests, make sure both COLOR and COLORS are updated, as the environment could have set one or the other, so we have to ensure both are overridden
		// test manual disable
		env.COLOR = env.COLORS = 'no'
		strictEqual(helpers.useColors(), false, 'colors should be disabled by env')
		strictEqual(helpers.inspect({ a: 1 }), '{ a: 1 }')
		// test manual enable
		env.COLOR = env.COLORS = 'yes'
		strictEqual(helpers.useColors(), true, 'colors should be enabled by env')
		strictEqual(helpers.inspect({ a: 1 }), '{ a: \u001b[33m1\u001b[39m }')
		// disable colors going forward
		env.COLOR = env.COLORS = 'no'
	})
	// skip log
	// skip logComparison
	test('equal', function () {
		helpers.equal(1, 1)
		try {
			helpers.equal(1, 2)
			fail()
		} catch {}
	})
	test('gte', function () {
		helpers.gte(2, 2)
		try {
			helpers.gte(1, 2)
			fail()
		} catch {}
	})
	test('gt', function () {
		helpers.gt(3, 2)
		try {
			helpers.gt(2, 2)
			fail()
		} catch {}
	})
	test('lte', function () {
		helpers.lte(2, 2)
		try {
			helpers.lte(2, 1)
			fail()
		} catch {}
	})
	test('lt', function () {
		helpers.lt(2, 3)
		try {
			helpers.lt(2, 2)
			fail()
		} catch {}
	})
	test('undef', function () {
		// @ts-expect-error we are testing type-unsafe code
		helpers.undef()
		try {
			helpers.undef(null)
			fail()
		} catch {}
	})
	test('nullish', function () {
		// @ts-expect-error we are testing type-unsafe code
		helpers.nullish()
		helpers.nullish(null)
		try {
			helpers.nullish(false)
			fail()
		} catch {}
	})
	test('deepEqual', function () {
		helpers.deepEqual({ a: 1 }, { a: 1 })
		try {
			helpers.deepEqual({ a: 1 }, { a: 2 })
			fail()
		} catch {}
	})
	test('contains', function () {
		helpers.contains('ab', 'a')
		try {
			helpers.contains('ab', 'c')
			fail()
		} catch {}
	})
	test('notContains', function () {
		helpers.notContains('ab', 'c')
		try {
			helpers.notContains('ab', 'a')
			fail()
		} catch {}
	})
	test('errorEqual', function () {
		const a = new Error('abc')
		helpers.errorEqual(a, 'abc')
		try {
			helpers.errorEqual(a, 'xyz')
			fail()
		} catch {}
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
		} catch {}
	})
	test('expectThrowViaFunction', function () {
		const a = new Error('abc')
		helpers.expectThrowViaFunction(a, (): never => {
			throw a
		})
		try {
			helpers.expectThrowViaFunction(a, () => false as never)
		} catch {}
	})
})
