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
    let warning = false

    const [key, options = {}] = envVar
    const {required = true, prefixed = true, values, type} = options

    const prefix = prefixed
      ? `${this.prefix}${this.prefix ? this.separator : ''}`
      : ''
    const fullKey = `${prefix}${key}`
    let value = process.env[fullKey]

    if (!value) {
      return required
        ? [raise.error, raise.error.MISSING]
        : [raise.warning, raise.warning.MISSING]
    }

    switch (type) {
      case undefined:
      case 'string':
      break
      case 'integer': {
        const parsed = Number.parseInt(value)

        if (parsed.toString() !== value) {
          return [raise.error, raise.error.INVALID, value]
        }

        value = parsed
      } break
      case 'float':
      case 'number':
        value = Number.parseFloat(value)

        if (Number.isNaN(value)) {
          return [raise.error, raise.error.INVALID, value]
        }
      break
      default: warning = [raise.warning, raise.warning.UNSUPPORTED_TYPE, type]
    }

    if (Array.isArray(values) && !values.includes(value)) {
      return [raise.error, raise.error.INVALID, value]
    }

    this._keys.push(key)

    Object.defineProperty(this, key, {
      get: () => value
    })

    return warning
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
  , UNSUPPORTED_TYPE: 'Unsupported type check'
  }
}

module.exports = CtrlEnv
