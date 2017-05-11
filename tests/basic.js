'use strict'

const tap = require('tap')

const CtrlEnv = require('../ctrl-env')

// Positives
tap.test('should throw missing required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['MISSING_REQUIRED_VAR']
  ])

  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should warn missing optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['MISSING_OPTIONAL_VAR', {required: false}]
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 1)
  t.equals(assertions.errors.length, 0)

  t.end()
})

tap.test('should throw invalid required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['INVALID_REQUIRED_VAR', {values: ['sparks fly']}]
  ])

  t.ok(process.env.INVALID_REQUIRED_VAR)
  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should throw invalid optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['INVALID_OPTIONAL_VAR', {values: ['sparks fly']}]
  ])

  t.ok(process.env.INVALID_OPTIONAL_VAR)
  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should throw overwrite getter', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.throws(() => {
    ctrlEnv.REQUIRED_VAR = 'blah'
  })

  t.end()
})

// Negatives
tap.test('should pass required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.REQUIRED_VAR, 'taylor swift')

  t.end()
})

tap.test('should pass optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['OPTIONAL_VAR', {required: false}]
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.OPTIONAL_VAR, '1989')

  t.end()
})

tap.test('should pass valid required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['VALID_REQUIRED_VAR', {values: ['sparks fly']}]
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.VALID_REQUIRED_VAR, 'sparks fly')

  t.end()
})

tap.test('should pass valid optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['VALID_OPTIONAL_VAR', {values: ['enchanted']}]
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.VALID_OPTIONAL_VAR, 'enchanted')

  t.end()
})

tap.test('should get required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.REQUIRED_VAR, 'taylor swift')

  t.end()
})

tap.test('should get all vars', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  , ['OPTIONAL_VAR', {required: false}]
  , ['VALID_REQUIRED_VAR', {values: ['sparks fly']}]
  , ['VALID_OPTIONAL_VAR', {values: ['enchanted']}]
  ])

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.deepEquals(ctrlEnv.all, {
    OPTIONAL_VAR: '1989'
  , REQUIRED_VAR: 'taylor swift'
  , VALID_OPTIONAL_VAR: 'enchanted'
  , VALID_REQUIRED_VAR: 'sparks fly'
  })

  t.end()
})
