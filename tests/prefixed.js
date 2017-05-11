'use strict'

const tap = require('tap')

const CtrlEnv = require('../ctrl-env')

// Positives
tap.test('should throw missing required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['MISSING_REQUIRED_VAR']
  ], {
    prefix: 'PREFIXED'
  })

  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should warn missing optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['MISSING_OPTIONAL_VAR', {required: false}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 1)
  t.equals(assertions.errors.length, 0)

  t.end()
})

tap.test('should throw invalid required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['INVALID_REQUIRED_VAR', {values: ['sparks fly b-side']}]
  ], {
    prefix: 'PREFIXED'
  })

  t.ok(process.env.INVALID_REQUIRED_VAR)
  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should throw invalid optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['INVALID_OPTIONAL_VAR', {values: ['sparks fly b-side']}]
  ], {
    prefix: 'PREFIXED'
  })

  t.ok(process.env.INVALID_OPTIONAL_VAR)
  t.throws(ctrlEnv.assert)

  t.end()
})

tap.test('should throw overwrite getter', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  ], {
    prefix: 'PREFIXED'
  })

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
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.REQUIRED_VAR, 'taylor swift b-side')

  t.end()
})

tap.test('should pass optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['OPTIONAL_VAR', {required: false}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.OPTIONAL_VAR, '1989 b-side')

  t.end()
})

tap.test('should pass valid required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['VALID_REQUIRED_VAR', {values: ['sparks fly b-side']}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.VALID_REQUIRED_VAR, 'sparks fly b-side')

  t.end()
})

tap.test('should pass valid optional var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['VALID_OPTIONAL_VAR', {values: ['enchanted b-side']}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.VALID_OPTIONAL_VAR, 'enchanted b-side')

  t.end()
})

tap.test('should get required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.REQUIRED_VAR, 'taylor swift b-side')

  t.end()
})

tap.test('should get all vars', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['REQUIRED_VAR']
  , ['OPTIONAL_VAR', {required: false}]
  , ['VALID_REQUIRED_VAR', {values: ['sparks fly b-side']}]
  , ['VALID_OPTIONAL_VAR', {values: ['enchanted b-side']}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.deepEquals(ctrlEnv.all, {
    OPTIONAL_VAR: '1989 b-side'
  , REQUIRED_VAR: 'taylor swift b-side'
  , VALID_OPTIONAL_VAR: 'enchanted b-side'
  , VALID_REQUIRED_VAR: 'sparks fly b-side'
  })

  t.end()
})

tap.test('should pass prefixless required var', (t) => {
  const ctrlEnv = new CtrlEnv([
    ['PREFIXLESS_REQUIRED_VAR', {prefixed: false}]
  ], {
    prefix: 'PREFIXED'
  })

  const assertions = ctrlEnv.assert()
  t.equals(assertions.warnings.length, 0)
  t.equals(assertions.errors.length, 0)

  t.equals(ctrlEnv.PREFIXLESS_REQUIRED_VAR, 'fearless')

  t.end()
})
