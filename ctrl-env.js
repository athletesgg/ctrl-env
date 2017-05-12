'use strict'

class CtrlEnv {
  constructor(variables, options = {}) {
    this._keys = []

    const {prefix = '', separator = '_'} = options

    this.variables = variables
    this.prefix = prefix
    this.separator = separator
  }

  reduceVariables(result, envVar) {
    const failure = this.check(envVar)

    if (!failure) {
      return result
    }

    const [type, message, value] = failure
    const fullMessage = `${message}: ${envVar[0]}${value ? ` ${value}` : ''}`

    if (type === CtrlEnv.raise.warning) {
      result.warnings.push(fullMessage)

      return result
    }

    result.errors.push(fullMessage)

    return result
  }

  check(envVar) {
    const raise = CtrlEnv.raise

    const [key, options = {}] = envVar
    const {required = true, prefixed = true, values} = options

    const prefix = prefixed
      ? `${this.prefix}${this.prefix ? this.separator : ''}`
      : ''
    const fullKey = `${prefix}${key}`
    const value = process.env[fullKey]

    if (!value) {
      return required
        ? [raise.error, raise.error.MISSING]
        : [raise.warning, raise.warning.MISSING]
    }

    if (Array.isArray(values) && !values.includes(value)) {
      return [raise.error, raise.error.INVALID, value]
    }

    this._keys.push(key)

    Object.defineProperty(this, key, {
      get: () => value
    })

    return false
  }

  assert() {
    const assertions = this.variables.reduce(this.reduceVariables.bind(this), {
      errors: []
    , warnings: []
    })

    const {errors, warnings} = assertions

    if (warnings.length > 0) {
      warnings.forEach((warning) => console.warn(warning))
    }

    if (errors.length > 0) {
      throw new Error(errors.join('\n'))
    }

    return assertions
  }

  get all() {
    return this._keys.reduce(
      (result, key) => (result[key] = this[key], result)
    , {}
    )
  }
}

CtrlEnv.raise = {
  error: {
    INVALID: 'Invalid value'
  , MISSING: 'Missing required key'
  }
, warning: {
    MISSING: 'Missing optional key'
  }
}

module.exports = CtrlEnv
