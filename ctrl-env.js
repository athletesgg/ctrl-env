'use strict'

class CtrlEnv {
  constructor(variables, options) {
    this._keys = []
    this.variables = variables
    this.prefix = options ? options.prefix : ''
    this.separator = options ? options.separator || '_' : '_'
  }

  get all() {
    return require('./lib/getters/all').call(this)
  }

  get raise() {
    return require('./lib/getters/raise')
  }
}

// Methods
const proto = CtrlEnv.prototype

proto.check = require('./lib/check')
proto.assert = require('./lib/assert')

module.exports = CtrlEnv
