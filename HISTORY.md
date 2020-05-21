# History

## v6.6.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.5.0 2020 May 21

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.4.0 2020 May 12

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.3.0 2020 May 11

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.2.0 2020 May 4

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.1.0 2020 May 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v6.0.0 2020 March 26

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Minimum required node version changed from `node: >=8` to `node: >=10` to keep up with mandatory ecosystem changes

## v5.8.0 2019 December 9

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.7.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.6.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.5.0 2019 December 1

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.4.0 2019 November 18

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.3.0 2019 November 13

-   Updated dependencies, [base files](https://github.com/bevry/base), and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v5.2.1 2019 November 13

-   Correct failure message on `nullish` assertion

## v5.2.0 2019 November 13

-   Add `nullish` assertion

## v5.1.0 2019 November 13

-   Add `undef` assertion

## v5.0.0 2019 November 10

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)
-   Changed `equal` and `deepEqual` to use their strict variants, which was first introduced in node.js v4, this [solves several issues with the prior variants](https://github.com/nodejs/node/issues/30350) which node.js deprecated
    -   As such, the minimum supported node version has changed from `0.12` to the latest LTS at the time of this release which is `8`
-   Changed `expectErrorViaFunction` and `expectFunctionToThrow` to now throw instead of failing silently due to their deprecation

## v4.10.0 2019 November 10

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.9.7 2019 September 11

-   Fix `TypeError: obj.hasOwnProperty is not a function` under special circumstances
    -   Closes [issue #5](https://github.com/bevry/assert-helpers/issues/5)
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.9.6 2019 January 2

-   Moved `@types/*` dev dependencies into dependencies, as otherwise TypeScript consumers would encounter issues

## v4.9.5 2019 January 2

-   Removed `index.d.ts` file which should have been trimmed in v4.9.4
-   Reverted jspm workaround between v4.9.0-4.9.2 as it caused issues with node consumption

## v4.9.4 2019 January 2

-   Fixed TypeScript consumption of types
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.9.3 2018 December 19

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.9.2 2018 December 19

-   Even more robust cross-browser-node support

## v4.9.1 2018 December 19

-   More robust cross-browser-node support

## v4.9.0 2018 December 19

-   Add support for browsers via jspm

## v4.8.0 2018 December 19

-   Fixed `TypeError: Cannot read property 'diffChars' of undefined` (regression since v4.6.0)
-   Added tests

## v4.7.0 2018 December 19

-   `package.json:types` is now a declaration file instead of a source file
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.6.0 2018 December 4

-   Rewrote in TypeScript.
-   Inspect now defaults the depth to `50` instead of enforcing it.
-   Removed `queue`. Now that environments now support `setImmediate` you should just use that.
-   Internal changes:
    -   `diffstrings` and `diffObjects` have been merged into `diff`, which on object types will use object comparison, otherwise it will use inspection comparison (before it would be a nooop on anything besides objects and strings)
    -   `logComparison` now uses `compare` which uses `diff`
-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.5.1 2018 January 31

-   Updated [base files](https://github.com/bevry/base) and [editions](https://editions.bevry.me) using [boundation](https://github.com/bevry/boundation)

## v4.5.0 2017 February 27

-   `log` no longer uses `for of` but `for` to support older environments
-   Updated dependencies

## v4.4.0 2016 June 4

-   Added `next` callbacks to most checks
-   Fixed `expectErrorViaFunction`

## v4.3.0 2016 June 2

-   Added default test names
-   Better documentation
-   Added `expectErrorViaFunction`

## v4.2.0 2016 May 2

-   Updated base files

## v4.1.0 2015 December 9

-   Moved from ECMAScript Modules to CommonJS Modules due to lack of Node.js support
-   Updated dependencies

## v4.0.1 2015 September 21

-   Fixed missing `esnextguardian` dependency (regression since v4.0.0)
-   Better browser compatibility

## v4.0.0 2015 September 20

-   Comparison output will now be inspected and diffed

## v3.0.0 2015 September 11

-   `expectErrorViaCallback` now accepts the arguments `error`, `testName`, `next`
-   Added `expectFunctionToThrow`

## v2.0.0 2015 September 11

-   Moved from CoffeeScript to ES6+
-   Renamed several methods and changed their arguments to provide greater consistency

## v1.0.2 2015 March 16

-   Fixed readme examples

## v1.0.1 2015 March 16

-   Added `contains(superString, subString, testName)`
-   Fixed comparison output on `errorEqual`

## v1.0.0 2015 March 16

-   Initial release, mostly based on the [TaskGroup](https://github.com/bevry/taskgroup) [utilities](https://github.com/bevry/taskgroup/blob/1ade5d54af699684ea411370e95a8293ed901b81/src/test/util.coffee)
