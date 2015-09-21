# History

## v4.0.1 September 21, 2015
- Fixed missing `esnextguardian` dependency (regression since v4.0.0)
- Better browser compatibility

## v4.0.0 September 20, 2015
- Comparison output will now be inspected and diffed

## v3.0.0 September 11, 2015
- `expectErrorViaCallback` now accepts the arguments `error`, `testName`, `next`
- Added `expectFunctionToThrow`

## v2.0.0 September 11, 2015
- Moved from CoffeeScript to ES6+
- Renamed several methods and changed their arguments to provide greater consistency

## v1.0.2 March 16, 2015
- Fixed readme examples

## v1.0.1 March 16, 2015
- Added `contains(superString, subString, testName)`
- Fixed comparison output on `errorEqual`

## v1.0.0 March 16, 2015
- Initial release, mostly based on the [TaskGroup](https://github.com/bevry/taskgroup) [utilities](https://github.com/bevry/taskgroup/blob/1ade5d54af699684ea411370e95a8293ed901b81/src/test/util.coffee)
