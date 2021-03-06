import applyDefaultsWithConstraints from '../../constraints/applyDefaultsWithConstraints'

describe(`applyDefaultsWithConstraints()`, () => {
  describe(`with no defaults`, () => {
    it(`returns the supplied value unchanged`, () => {
      const value = {
        a: 1,
      }
      const constraints = [
        {
          name: `a`,
          isRequired: true,
        },
        {
          name: `b`,
        },
      ]

      const validator = applyDefaultsWithConstraints(constraints)
      const validation = validator(value)
      expect(validation).toEqualSuccessWithValue(value)
    })
  })

  describe(`with defaults for undefined props`, () => {
    it(`applies the defaults`, () => {
      const defaultValue = `x`
      const value = {
        a: 1,
      }

      const expected = {
        a: 1,
        b: defaultValue,
      }

      const constraints = [
        {
          name: `a`,
          isRequired: true,
        },
        {
          name: `b`,
          defaultValue,
        },
      ]

      const validator = applyDefaultsWithConstraints(constraints)
      const validation = validator(value)
      expect(validation).toEqualSuccessWithValue(expected)
    })
  })

  describe(`with defaults for defined props`, () => {
    it(`doesn't apply the defaults`, () => {
      const defaultValue = `x`
      const value = {
        a: 1,
        b: 2,
      }
      const constraints = [
        {
          name: `a`,
          isRequired: true,
        },
        {
          name: `b`,
          defaultValue,
        },
      ]

      const validator = applyDefaultsWithConstraints(constraints)
      const validation = validator(value)
      expect(validation).toEqualSuccessWithValue(value)
    })
  })
})
