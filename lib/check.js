'use strict'

const get = require('lodash.get')

module.exports = function check(envVar) {
  const raise = this.raise

  const key = envVar[0]
  const options = envVar[1]

  const required = get(options, 'required', true)
  const values = get(options, 'values')

  const prefix = `${this.prefix}${this.prefix ? this.separator : ''}`
  const fullKey = `${prefix}${key}`
  const value = process.env[fullKey]

  if (!value) {
    return required
      ? [raise.error, raise.error.MISSING]
      : [raise.warning, raise.warning.MISSING]
  }

  if (
     value
  && Array.isArray(values)
  && !values.includes(value)
  ) {
    return [raise.error, raise.error.INVALID, value]
  }

  Object.defineProperty(this, key, {
    get: () => {return value}
  })

  return false
}
