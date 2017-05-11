'use strict'

module.exports = function check(envVar) {
  const raise = this.constructor.raise

  const key = envVar[0]
  const {required = true, prefixed = true, values} = envVar[1] || {}

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

  if (
     value
  && Array.isArray(values)
  && !values.includes(value)
  ) {
    return [raise.error, raise.error.INVALID, value]
  }

  this._keys.push(key)

  Object.defineProperty(this, key, {
    get: () => value
  })

  return false
}
