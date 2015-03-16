
<!-- TITLE/ -->

# Assert Utilities & Helpers

<!-- /TITLE -->


<!-- BADGES/ -->

[![Build Status](https://img.shields.io/travis/bevry/assert-helpers/master.svg)](http://travis-ci.org/bevry/assert-helpers "Check this project's build status on TravisCI")
[![NPM version](https://img.shields.io/npm/v/assert-helpers.svg)](https://npmjs.org/package/assert-helpers "View this project on NPM")
[![NPM downloads](https://img.shields.io/npm/dm/assert-helpers.svg)](https://npmjs.org/package/assert-helpers "View this project on NPM")
[![Dependency Status](https://img.shields.io/david/bevry/assert-helpers.svg)](https://david-dm.org/bevry/assert-helpers)
[![Dev Dependency Status](https://img.shields.io/david/dev/bevry/assert-helpers.svg)](https://david-dm.org/bevry/assert-helpers#info=devDependencies)<br/>
[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

Common utilities and helpers to make testing assertions easier

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

## Install

### [NPM](http://npmjs.org/)
- Use: `require('assert-helpers')`
- Install: `npm install --save assert-helpers`

### [Browserify](http://browserify.org/)
- Use: `require('assert-helpers')`
- Install: `npm install --save assert-helpers`
- CDN URL: `//wzrd.in/bundle/assert-helpers@1.0.2`

### [Ender](http://enderjs.com)
- Use: `require('assert-helpers')`
- Install: `ender add assert-helpers`

<!-- /INSTALL -->


## Usage

``` coffeescript
assertHelpers = require('assert-helpers')

assertHelpers.wait 1000, ->
	# this will execute after 1 second

assertHelpers.throwUnexpected()
# ^ this will throw an error stating that the error was unexpected

assertHelpers.expectEqual('actual results', 'expected results', 'the test name')
# ^ this will check that the actual requests equals the expected results
# it will output the comparison if the comparison fails

assertHelpers.expectDeepEqual('actual results', 'expected results', 'the test name')
# ^ this will check that the actual requests deeply equal the expected results
# it will output the comparison if the comparison fails

assertHelpers.contains('string one', 'string two', 'the test name')
# ^ this will check that string one contains string two
# it will output the comparison if the comparison fails

assertHelpers.expectError(theErrorWeReceived, 'the error we expect it to be', 'the test name')
# ^ this will check that the error we received is the error we expect
# it will output the comparison if the comparison fails

assertHelpers.returnViaCallback('result')
# ^ this will return a function that will return the result

assertHelpers.completeViaCallback('result', 100)
# ^ this will return a function that will receive a completion callback as its first argument, that will call the competion callback with the result after the delay

assertHelpers.returnErrorViaCallback('the error or error message')
# ^ this will return a function that will return the error

assertHelpers.expectViaCallback('expected', 'result', 'arguments')
# ^ this will return a function that will compare it's received arguments with our expected arguments

assertHelpers.expectErrorViaCallback('the error we expect', anOptionalCompletionCallback)
# ^ this will return a function that will compare its received error (its first received argument) with the error we expect it to be
# it will output the comparison if the comparison fails
# it accepts an optional completion callback argument if you'd prefer not to throw the error or are doing an asynchronous test
```

<!-- HISTORY/ -->

## History
[Discover the change history by heading on over to the `HISTORY.md` file.](https://github.com/bevry/assert-helpers/blob/master/HISTORY.md#files)

<!-- /HISTORY -->


<!-- CONTRIBUTE/ -->

## Contribute

[Discover how you can contribute by heading on over to the `CONTRIBUTING.md` file.](https://github.com/bevry/assert-helpers/blob/master/CONTRIBUTING.md#files)

<!-- /CONTRIBUTE -->


<!-- BACKERS/ -->

## Backers

### Maintainers

These amazing people are maintaining this project:

- Benjamin Lupton <b@lupton.cc> (https://github.com/balupton)

### Sponsors

No sponsors yet! Will you be the first?

[![Gratipay donate button](https://img.shields.io/gratipay/bevry.svg)](https://www.gratipay.com/bevry/ "Donate weekly to this project using Gratipay")
[![Flattr donate button](https://img.shields.io/badge/flattr-donate-yellow.svg)](http://flattr.com/thing/344188/balupton-on-Flattr "Donate monthly to this project using Flattr")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=QB8GQPZAH84N6 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg)](https://coinbase.com/checkouts/9ef59f5479eec1d97d63382c9ebcb93a "Donate once-off to this project using BitCoin")
[![Wishlist browse button](https://img.shields.io/badge/wishlist-donate-yellow.svg)](http://amzn.com/w/2F8TXKSNAFG4V "Buy an item on our wishlist for us")

### Contributors

These amazing people have contributed code to this project:

- [Benjamin Lupton](https://github.com/balupton) <b@lupton.cc> — [view contributions](https://github.com/bevry/assert-helpers/commits?author=balupton)

[Become a contributor!](https://github.com/bevry/assert-helpers/blob/master/CONTRIBUTING.md#files)

<!-- /BACKERS -->


<!-- LICENSE/ -->

## License

Unless stated otherwise all works are:

- Copyright &copy; 2015+ Bevry Pty Ltd <us@bevry.me> (http://bevry.me)

and licensed under:

- The incredibly [permissive](http://en.wikipedia.org/wiki/Permissive_free_software_licence) [MIT License](http://opensource.org/licenses/mit-license.php)

<!-- /LICENSE -->


