# History

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
