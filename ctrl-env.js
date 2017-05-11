'use strict'

class CtrlEnv {
  constructor(variables, options = {}) {
    this._keys = []

    const {prefix = '', separator = '_'} = options

    this.variables = variables
    this.prefix = prefix
    this.separator = separator
  }

  get all() {
    return require('./lib/getters/all').call(this)
  }

  static get raise() {
    return require('./lib/getters/raise')
  }
}

// Methods
const proto = CtrlEnv.prototype

proto.check = require('./lib/check')
proto.assert = require('./lib/assert')

module.exports = CtrlEnv
