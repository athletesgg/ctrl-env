# ctrl-env

[![Build Status](https://travis-ci.org/martin-experiments/ctrl-env.svg?branch=master)](https://travis-ci.org/martin-experiments/ctrl-env)

An alternative way to assert environment variables.

## Installation

```bash
$ npm install --save ctrl-env
```

## Usage

```javascript
// Example app.js:

const CtrlEnv = require('ctrl-env')

const ctrlEnv = new CtrlEnv([
  ['SECRET']
, ['PORT', {required: false}]
], {
  prefix: 'TWITTER_FEED'
})

ctrlEnv.assert()

// Some Twitter Feed and Server pseudo code:

http.on('/feed', (request, response) => {
  Twitter.getFeed({
    handle: '_experiments'
  , secret: ctrlEnv.SECRET
  }, (error, feed) => {
    if (error) {
      throw error
    }

    response.send(feed)
  })
})

http.listen(ctrlEnv.PORT)
```

```bash
$ TWITTER_FEED_SECRET='twitter_secret_key' TWITTER_FEED_PORT=8080 node app.js
$ # or
$ TWITTER_FEED_SECRET='twitter_secret_key' node app.js
```

### Methods

#### constructor(*Array* environmentVariables, *Object* options)

The constructor takes an array of environment variables to expect. The variables
themselves can be configured:

```javascript
const exampleEnvVars = [
  // Variable is required and can be any value:
  ['REQUIRED_VARIABLE']

  // Variable is optional and can be any value:
, ['OPTIONAL_VARIABLE', {required: false}]

  // Variable is required and can only be yes or no:
, ['LIMITED_VARIABLE', {values: ['yes', 'no']}]

  // Variable is optional and can only be yes or no:
, ['OPTIONAL_LIMITED_VARIABLE', {required: false, values: ['yes', 'no']}]
]

const ctrlEnv = new CtrlEnv(exampleEnvVars)
```

The constructor also takes an optional `prefix` and `separator`. The `separator`
only determines what seperates the prefix and the variable name:

```javascript
// Variables must be labeled TEST_(VARIABLENAME):
new CtrlEnv(..., {prefix: 'TEST'})

// Variables must be labeled TEST___(VARIABLENAME)
new CtrlEnv(..., {prefix: 'TEST', separator: '___'})
```

#### ctrlEnv.assert()

This method actually reads the environment variables and asserts that they exist
or have the required values. Note: This method is synchronous.

## License

Copyright (c) 2016 Martin Experiments LLC

MIT (https://www.opensource.org/licenses/MIT)
