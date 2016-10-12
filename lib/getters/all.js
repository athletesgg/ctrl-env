'use strict'

module.exports = function all() {
  return this._keys.reduce((result, key) => {
    result[key] = this[key]

    return result
  }, {})
}
