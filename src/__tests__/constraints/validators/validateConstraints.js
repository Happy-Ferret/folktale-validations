import { keys, map, assoc, dissoc } from 'ramda'
import validateConstraints from '../../../constraints/validators/validateConstraints'
import { func } from '../../testHelpers/fixtures/generic'
import typeData from '../../testHelpers/fixtures/typeData'
import FAILURE_FIELD_NAMES from '../../../const/failureFieldNames'
import CONSTRAINT_FIELD_NAMES from '../../../const/constraintFieldNames'
import constraints from '../../../constraints/constraints'
import {
  value1,
  value2,
  value3,
  value4,
  value5,
  value6,
  value7,
  value8,
  name1,
  invalidKeyName,
} from '../../testHelpers/fixtures/generic'
import { pluralise, joinWithAnd } from '../../../utils/formatting'
import testLevels from '../../testHelpers/testLevels'
import constraintsLevels from '../../testHelpers/data/constraintsLevels'
import toPayload from '../../../failures/toPayload'
import {
  IS_PLAIN_OBJECT,
  WHITELISTED_KEYS,
  REQUIRED_KEYS,
  EXCLUSIVE_KEYS,
  IS_ARRAY,
  ARRAY_ELEMENTS,
  IS_FUNCTION,
  IS_BOOLEAN,
  IS_NOT_UNDEFINED,
} from '../../../const/validatorUids'

const {
  FIELDS,
  FIELDS_VALIDATOR,
  NAME,
  VALIDATOR,
  TRANSFORMER,
  IS_REQUIRED,
  DEFAULT_VALUE,
  VALUE,
  CHILDREN,
} = CONSTRAINT_FIELD_NAMES

const requiredKeys = [NAME, VALIDATOR]

const { FIELDS_FAILURE_MESSAGE } = FAILURE_FIELD_NAMES

const requiredFields = {
  [NAME]: name1,
  [VALIDATOR]: func,
}

const exclusiveKeys = [
  {
    [IS_REQUIRED]: true,
    [DEFAULT_VALUE]: value1,
  },
  {
    [VALUE]: {},
    [CHILDREN]: {},
  },
]

const fieldErrors = [
  // [NAME, `Wasn't 'String'`, typeData.withoutStringValues],
  [VALIDATOR, IS_FUNCTION, typeData.withoutFunctionValues],
  [TRANSFORMER, IS_FUNCTION, typeData.withoutFunctionValues],
  [IS_REQUIRED, IS_BOOLEAN, typeData.withoutBooleanValues],
  [DEFAULT_VALUE, IS_NOT_UNDEFINED, typeData.undefinedValues],
  [VALUE, IS_PLAIN_OBJECT, typeData.withoutObjectValues],
  [CHILDREN, IS_PLAIN_OBJECT, typeData.withoutObjectValues],
]

const requiredKeysWithout = fieldName => dissoc(fieldName)(requiredFields)

describe(`validateConstraints`, () => {
  const validateConstraintsConfigured = validateConstraints(constraints)

  // ---------------------------------------------------------------------------
  // Full nested constraint object with all features
  // ---------------------------------------------------------------------------

  describe(`with valid constraints`, () => {
    it.only(`returns a Validation.Success with supplied value`, () => {
      const value = {
        [FIELDS]: [
          {
            [NAME]: value1,
            [VALIDATOR]: func,
            [IS_REQUIRED]: true,
            [TRANSFORMER]: func,
            [CHILDREN]: {
              [FIELDS]: [
                {
                  [NAME]: value3,
                  [VALIDATOR]: func,
                  [CHILDREN]: {}, // Allow empty object as value of childrn
                },
                {
                  [NAME]: value4,
                  [VALIDATOR]: func,
                  [CHILDREN]: {
                    [FIELDS]: [], // Allow empty array as value of fields
                  },
                },
                {
                  [NAME]: value5,
                  [VALIDATOR]: func,
                  [VALUE]: {}, // Allow empty object as value of value
                },
                {
                  [NAME]: value6,
                  [VALIDATOR]: func,
                  [DEFAULT_VALUE]: true,
                  [TRANSFORMER]: func,
                  [CHILDREN]: {
                    [FIELDS]: [
                      {
                        [NAME]: value7,
                        [VALIDATOR]: func,
                      },
                      {
                        [NAME]: value8,
                        [VALIDATOR]: func,
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            [NAME]: value2,
            [VALIDATOR]: func,
            [DEFAULT_VALUE]: true,
            [TRANSFORMER]: func,
          },
        ],
      }
      const validation = validateConstraintsConfigured(value)
      expect(validation).toEqualSuccessWithValue(value)
    })
  })

  // ---------------------------------------------------------------------------
  // Perform tests for multiple levels of nesting
  // ---------------------------------------------------------------------------

  testLevels(constraintsLevels, (level, withValueRoot, withExpectedRoot) => {
    describe(`with ${level} constraint ${pluralise(`level`, level)}`, () => {
      // -----------------------------------------------------------------------
      // 1. Value itself
      // -----------------------------------------------------------------------
      describe(`value itself`, () => {
        describe(`with empty object`, () => {
          it.only(`returns a Validation.Success with supplied value`, () => {
            const value = withValueRoot({})
            const validation = validateConstraintsConfigured(value)
            expect(validation).toEqualSuccessWithValue(value)
          })
        })

        describe(`with invalid value`, () => {
          it.only(`returns a Validation.Failure with payload`, () => {
            map(value => {
              const validation = validateConstraintsConfigured(
                withValueRoot(value)
              )

              const expectedValue = withExpectedRoot(
                toPayload(IS_PLAIN_OBJECT, value)
              )

              expect(validation).toEqualFailureWithValue(expectedValue)
            }, typeData.withoutObjectValues)
          })
        })

        // ---------------------------------------------------------------------
        // 1.1 Keys
        // ---------------------------------------------------------------------

        describe(`with additional keys`, () => {
          it.only(`returns a Validation.Failure with payload`, () => {
            const o = {
              [invalidKeyName]: value1,
            }

            const value = withValueRoot(o)

            const expectedValue = withExpectedRoot({
              [FIELDS_FAILURE_MESSAGE]: toPayload(WHITELISTED_KEYS, o, [
                [FIELDS_VALIDATOR, FIELDS],
                [invalidKeyName],
              ]),
            })

            const validation = validateConstraintsConfigured(value)

            expect(validation).toEqualFailureWithValue(expectedValue)
          })
        })

        describe(`with missing required keys`, () => {
          map(fieldName => {
            describe(fieldName, () => {
              it.only(`returns a Validation.Failure with payload`, () => {
                const fields = requiredKeysWithout(fieldName)
                const o = {
                  [FIELDS]: [fields],
                }
                const value = withValueRoot(o)

                const expectedValue = withExpectedRoot({
                  [FIELDS]: {
                    [FIELDS]: {
                      [CHILDREN]: [
                        {
                          [FIELDS_FAILURE_MESSAGE]: toPayload(
                            REQUIRED_KEYS,
                            fields,
                            [requiredKeys, [fieldName]]
                          ),
                        },
                      ],
                    },
                  },
                })

                const validation = validateConstraintsConfigured(value)
                expect(validation).toEqualFailureWithValue(expectedValue)
              })
            })
          })(requiredKeys)
        })

        describe(`with exclusive keys:`, () => {
          map(keyPair => {
            const keyNames = keys(keyPair)
            describe(`${joinWithAnd(keyNames)}`, () => {
              it.only(`returns a Validation.Failure with payload`, () => {
                const o = {
                  [NAME]: value1,
                  [VALIDATOR]: func,
                  ...keyPair,
                }

                const value = withValueRoot({
                  [FIELDS]: [o],
                })

                const validation = validateConstraintsConfigured(value)

                const pair = keys(keyPair)
                const expectedValue = withExpectedRoot({
                  [FIELDS]: {
                    [FIELDS]: {
                      [CHILDREN]: [
                        {
                          [FIELDS_FAILURE_MESSAGE]: toPayload(
                            EXCLUSIVE_KEYS,
                            o,
                            [pair, pair]
                          ),
                        },
                      ],
                    },
                  },
                })

                expect(validation).toEqualFailureWithValue(expectedValue)
              })
            })
          })(exclusiveKeys)
        })

        describe(`with missing required keys`, () => {
          map(fieldName => {
            describe(fieldName, () => {
              it.only(`returns a Validation.Failure with payload`, () => {
                const fields = requiredKeysWithout(fieldName)
                const o = {
                  [FIELDS]: [fields],
                }

                const value = withValueRoot(o)

                const expectedValue = withExpectedRoot({
                  [FIELDS]: {
                    [FIELDS]: {
                      [CHILDREN]: [
                        {
                          [FIELDS_FAILURE_MESSAGE]: toPayload(
                            REQUIRED_KEYS,
                            fields,
                            [[NAME, VALIDATOR], [fieldName]]
                          ),
                        },
                      ],
                    },
                  },
                })

                const validation = validateConstraintsConfigured(value)

                expect(validation).toEqualFailureWithValue(expectedValue)
              })
            })
          })(requiredKeys)
        })

        // ---------------------------------------------------------------------
        // 1.2 fields
        // ---------------------------------------------------------------------

        describe(`'fields'`, () => {
          describe(`non-array value`, () => {
            it.only(`returns a Validation.Failure with payload`, () => {
              map(fieldValue => {
                const value = withValueRoot({
                  [FIELDS]: fieldValue,
                })

                const expected = withExpectedRoot({
                  [FIELDS]: {
                    [FIELDS]: toPayload(IS_ARRAY, fieldValue),
                  },
                })
                const validation = validateConstraintsConfigured(value)
                expect(validation).toEqualFailureWithValue(expected)
              }, typeData.withoutArrayValues)
            })
          })

          describe(`array containing non-object values`, () => {
            it(`returns a Validation.Failure with payload`, () => {
              map(fieldValue => {
                const value = withValueRoot({
                  [FIELDS]: [fieldValue],
                })
                const validation = validateConstraintsConfigured(value)

                const expected = withExpectedRoot({
                  [FIELDS]: {
                    [FIELDS]: toPayload(ARRAY_ELEMENTS, fieldValue),
                  },
                })

                expect(validation).toEqualFailureWithValue(expected)
              })(typeData.withoutObjectValues)
            })
          })

          describe(`key values`, () => {
            map(([fieldName, validatorUID, typeDataValues]) => {
              describe(`with invalid value for '${fieldName}'`, () => {
                it.only(`returns a Validation.Failure with payload`, () => {
                  map(fieldValue => {
                    const allFields = assoc(
                      fieldName,
                      fieldValue,
                      requiredFields
                    )

                    const value = withValueRoot({
                      [FIELDS_VALIDATOR]: func,
                      [FIELDS]: [allFields],
                    })

                    const expected = withExpectedRoot({
                      [FIELDS]: {
                        [FIELDS]: {
                          [CHILDREN]: [
                            {
                              [FIELDS]: {
                                [fieldName]: toPayload(
                                  validatorUID,
                                  fieldValue
                                ),
                              },
                            },
                          ],
                        },
                      },
                    })

                    const validation = validateConstraintsConfigured(value)
                    expect(validation).toEqualFailureWithValue(expected)
                  }, typeDataValues)
                })
              })
            })(fieldErrors)
          })

          // -------------------------------------------------------------------
          // 1.3 fieldsValidator
          // -------------------------------------------------------------------

          describe(`'fieldsValidator'`, () => {
            describe(`with non-function value`, () => {
              it.only(`returns a Validation.Failure with payload`, () => {
                map(fieldValue => {
                  const value = withValueRoot({
                    [FIELDS_VALIDATOR]: fieldValue,
                    [FIELDS]: [],
                  })

                  const expected = withExpectedRoot({
                    [FIELDS]: {
                      [FIELDS_VALIDATOR]: toPayload(IS_FUNCTION, fieldValue),
                    },
                  })

                  const validation = validateConstraintsConfigured(value)
                  expect(validation).toEqualFailureWithValue(expected)
                }, typeData.withoutFunctionValues)
              })
            })
          })

          // -------------------------------------------------------------------
          // 1.4 children and value
          // -------------------------------------------------------------------

          map(fieldName => {
            describe(fieldName, () => {
              describe(`empty object`, () => {
                it.only(`returns a Validation.Success with supplied value`, () => {
                  const value = withValueRoot({
                    [FIELDS]: [
                      {
                        ...requiredFields,
                        [fieldName]: {},
                      },
                    ],
                  })
                  const validation = validateConstraintsConfigured(value)
                  expect(validation).toEqualSuccessWithValue(value)
                })
              })
            })
          })([CHILDREN, VALUE])
        })
      })
    })
  })
})
