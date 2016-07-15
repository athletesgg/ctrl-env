'use strict'

const get = require('lodash.get')

const raise = {
  error: {
    MISSING: 'Missing required key'
  , INVALID: 'Invalid value'
  }
, warning: {
    MISSING: 'Missing optional key'
  }
}

const vars = Symbol('vars')

class CtrlEnv {
  constructor(variables, options) {
    this.variables = variables
    this.prefix = options ? options.prefix : ''
    this.separator = options ? options.separator || '_' : '_'

    // Private Variables
    this[vars] = {}
  }

  check(envVar) {
    const key = envVar[0]
    const options = envVar[1]

    const required = get(options, 'required', true)
    const values = get(options, 'values')

    const fullKey = `${this.prefix}${this.prefix ? this.separator : ''}${key}`
    const value = process.env[fullKey]

    if (!value) {
      return required
        ? [raise.error, raise.error.MISSING]
        : [raise.warning, raise.warning.MISSING]
    }

    if (value && Array.isArray(values) && !values.includes(value)) {
      return [raise.error, raise.error.INVALID, value]
    }

    this[vars][key] = value

    return false
  }

  assert() {
    const assertions = this.variables.reduce((result, envVar) => {
      const failure = this.check(envVar)

      if (!failure) {
        return result
      }

      const type = failure[0]
      const message = failure[1]
      const value = failure[2]
      const fullMessage = `${message}: ${envVar[0]}${value ? ' ' + value : ''}`

      if (type === raise.warning) {
        result.warnings.push(fullMessage)
        return result
      }

      result.errors.push(fullMessage)
      return result
    }, {errors: [], warnings: []})

    if (assertions.warnings.length > 0) {
      assertions.warnings.forEach((warning) => {console.warn(warning)})
    }

    if (assertions.errors.length > 0) {
      throw new Error(assertions.errors.join('\n'))
    }

    return assertions
  }

  get(key) {
    return this[vars][key]
  }
}

module.exports = CtrlEnv
