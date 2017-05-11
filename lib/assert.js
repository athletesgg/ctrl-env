'use strict'

module.exports = function assert() {
  const raise = this.constructor.raise

  const assertions = this.variables.reduce((result, envVar) => {
    const failure = this.check(envVar)

    if (!failure) {
      return result
    }

    const type = failure[0]
    const message = failure[1]
    const value = failure[2]
    const fullMessage = `${message}: ${envVar[0]}${value ? ` ${value}` : ''}`

    if (type === raise.warning) {
      result.warnings.push(fullMessage)

      return result
    }

    result.errors.push(fullMessage)

    return result
  }, {errors: [], warnings: []})

  if (assertions.warnings.length > 0) {
    assertions.warnings.forEach((warning) => console.warn(warning))
  }

  if (assertions.errors.length > 0) {
    throw new Error(assertions.errors.join('\n'))
  }

  return assertions
}
