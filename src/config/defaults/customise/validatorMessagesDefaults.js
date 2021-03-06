import { always } from 'ramda'
import {
  joinWithColon,
  wrapWithSingleQuotes,
  joinWithSpace,
  toList,
} from '../../../utils/formatting'
import * as UIDS from '../../../const/validatorUids'
import PREDICATE_NAMES from '../../../const/predicateNames'

// -----------------------------------------------------------------------------
// Predicate
// -----------------------------------------------------------------------------

const predicateMessage = name => always(joinWithSpace([`Wasn't`, name]))

const negatedPredicateMessage = name => always(joinWithSpace([`Was`, name]))

// -----------------------------------------------------------------------------
// Association
// -----------------------------------------------------------------------------

const isLengthGreaterThanMessage = length =>
  `Length wasn't greater than '${length}'`

const isLengthLessThanMessage = length => `Length wasn't less than '${length}'`

const isLengthBetweenMessage = (low, high) =>
  `Length wasn't between '${low}' and '${high}'`

// -----------------------------------------------------------------------------
// Object
// -----------------------------------------------------------------------------

const exclusiveKeysMessage = keys =>
  joinWithColon([`had more than one exlusive key`, toList(keys)])

const requiredKeysMessage = keys =>
  joinWithColon([`missing required key(s)`, toList(keys)])

const whitelistedKeysMessage = keys =>
  joinWithColon([`included key(s) not on whitelist`, toList(keys)])

// -----------------------------------------------------------------------------
// Other
// -----------------------------------------------------------------------------

const isWhitelistedValueMessage = whitelist =>
  joinWithColon([`Value wasn't on the whitelist`, toList(whitelist)])

const isNotBlacklistedValueMessage = blacklist =>
  joinWithColon([`Value was on the blacklist`, toList(blacklist)])

const isNumberWithUnitMessage = unit =>
  joinWithColon([`Wasn't number with unit`, wrapWithSingleQuotes(unit)])

const isNonNegativeNumberWithUnitMessage = unit =>
  joinWithColon([
    `Wasn't valid non-negative number with unit`,
    wrapWithSingleQuotes(unit),
  ])

const isPositiveNumberWithUnitMessage = unit =>
  joinWithColon([
    `Wasn't valid positive number with unit`,
    wrapWithSingleQuotes(unit),
  ])

const messageMap = {
  // ---------------------------------------------------------------------------
  // Predicate
  // ---------------------------------------------------------------------------
  // Basic Types
  [UIDS.VALIDATE_IS_ARRAY]: predicateMessage(PREDICATE_NAMES.Array),
  [UIDS.VALIDATE_IS_NOT_ARRAY]: negatedPredicateMessage(PREDICATE_NAMES.Array),
  [UIDS.VALIDATE_IS_OBJECT]: predicateMessage(PREDICATE_NAMES.Object),
  [UIDS.VALIDATE_IS_NOT_OBJECT]: negatedPredicateMessage(
    PREDICATE_NAMES.Object
  ),
  [UIDS.VALIDATE_IS_BOOLEAN]: predicateMessage(PREDICATE_NAMES.Boolean),
  [UIDS.VALIDATE_IS_NOT_BOOLEAN]: negatedPredicateMessage(
    PREDICATE_NAMES.Boolean
  ),
  [UIDS.VALIDATE_IS_STRING]: predicateMessage(PREDICATE_NAMES.String),
  [UIDS.VALIDATE_IS_NOT_STRING]: negatedPredicateMessage(
    PREDICATE_NAMES.String
  ),
  [UIDS.VALIDATE_IS_FUNCTION]: predicateMessage(PREDICATE_NAMES.Function),
  [UIDS.VALIDATE_IS_NOT_FUNCTION]: negatedPredicateMessage(
    PREDICATE_NAMES.Function
  ),
  [UIDS.VALIDATE_IS_NUMBER]: predicateMessage(PREDICATE_NAMES.Number),
  [UIDS.VALIDATE_IS_NOT_NUMBER]: negatedPredicateMessage(
    PREDICATE_NAMES.Number
  ),

  // Complex Objs
  [UIDS.VALIDATE_IS_DATE]: predicateMessage(PREDICATE_NAMES.Date),
  [UIDS.VALIDATE_IS_NOT_DATE]: negatedPredicateMessage(PREDICATE_NAMES.Date),
  [UIDS.VALIDATE_IS_REGEXP]: predicateMessage(PREDICATE_NAMES.RegExp),
  [UIDS.VALIDATE_IS_NOT_REGEXP]: negatedPredicateMessage(
    PREDICATE_NAMES.RegExp
  ),
  [UIDS.VALIDATE_IS_PLAIN_OBJECT]: predicateMessage(
    PREDICATE_NAMES.plainObject
  ),
  [UIDS.VALIDATE_IS_NOT_PLAIN_OBJECT]: negatedPredicateMessage(
    PREDICATE_NAMES.plainObject
  ),

  // Nil Values
  [UIDS.VALIDATE_IS_NAN]: predicateMessage(PREDICATE_NAMES.NaN),
  [UIDS.VALIDATE_IS_NOT_NAN]: negatedPredicateMessage(PREDICATE_NAMES.NaN),
  [UIDS.VALIDATE_IS_NIL]: predicateMessage(PREDICATE_NAMES.Nil),
  [UIDS.VALIDATE_IS_NOT_NIL]: negatedPredicateMessage(PREDICATE_NAMES.Nil),
  [UIDS.VALIDATE_IS_NULL]: predicateMessage(PREDICATE_NAMES.Null),
  [UIDS.VALIDATE_IS_NOT_NULL]: negatedPredicateMessage(PREDICATE_NAMES.Null),
  [UIDS.VALIDATE_IS_UNDEFINED]: predicateMessage(PREDICATE_NAMES.Undefined),
  [UIDS.VALIDATE_IS_NOT_UNDEFINED]: negatedPredicateMessage(
    PREDICATE_NAMES.Undefined
  ),

  // Empty
  [UIDS.VALIDATE_IS_EMPTY]: predicateMessage(PREDICATE_NAMES.empty),
  [UIDS.VALIDATE_IS_NOT_EMPTY]: negatedPredicateMessage(PREDICATE_NAMES.empty),
  [UIDS.VALIDATE_IS_EMPTY_ARRAY]: predicateMessage(PREDICATE_NAMES.emptyArray),
  [UIDS.IS_NON_EMPTY_ARRAY]: negatedPredicateMessage(
    PREDICATE_NAMES.emptyArray
  ),
  [UIDS.VALIDATE_IS_EMPTY_STRING]: predicateMessage(
    PREDICATE_NAMES.emptyString
  ),
  [UIDS.VALIDATE_IS_NON_EMPTY_STRING]: negatedPredicateMessage(
    PREDICATE_NAMES.emptyString
  ),

  // Valid
  [UIDS.VALIDATE_IS_VALID_DATE]: predicateMessage(PREDICATE_NAMES.validDate),
  [UIDS.VALIDATE_IS_NOT_VALID_DATE]: negatedPredicateMessage(
    PREDICATE_NAMES.validDate
  ),
  [UIDS.VALIDATE_IS_VALID_NUMBER]: predicateMessage(
    PREDICATE_NAMES.validNumber
  ),
  [UIDS.VALIDATE_IS_NOT_VALID_NUMBER]: negatedPredicateMessage(
    PREDICATE_NAMES.validNumber
  ),

  // Numeric
  [UIDS.VALIDATE_IS_INTEGER]: predicateMessage(PREDICATE_NAMES.integer),
  [UIDS.VALIDATE_IS_NOT_INTEGER]: negatedPredicateMessage(
    PREDICATE_NAMES.integer
  ),
  [UIDS.VALIDATE_IS_POSITIVE]: predicateMessage(PREDICATE_NAMES.positive),
  [UIDS.VALIDATE_IS_NEGATIVE]: predicateMessage(PREDICATE_NAMES.negative),
  [UIDS.VALIDATE_IS_NON_POSITIVE]: predicateMessage(
    PREDICATE_NAMES.nonPositive
  ),
  [UIDS.VALIDATE_IS_NON_NEGATIVE]: predicateMessage(
    PREDICATE_NAMES.nonNegative
  ),

  // Truth
  [UIDS.VALIDATE_IS_TRUE]: predicateMessage(PREDICATE_NAMES.true),
  [UIDS.VALIDATE_IS_FALSE]: predicateMessage(PREDICATE_NAMES.false),
  [UIDS.VALIDATE_IS_TRUTHY]: predicateMessage(PREDICATE_NAMES.truthy),
  [UIDS.VALIDATE_IS_FALSY]: predicateMessage(PREDICATE_NAMES.falsy),

  // ---------------------------------------------------------------------------
  // Association
  // ---------------------------------------------------------------------------
  [UIDS.VALIDATE_IS_LENGTH_BETWEEN]: isLengthBetweenMessage,
  [UIDS.VALIDATE_IS_LENGTH_GREATER_THAN]: isLengthGreaterThanMessage,
  [UIDS.VALIDATE_IS_LENGTH_LESS_THAN]: isLengthLessThanMessage,

  // ---------------------------------------------------------------------------
  // Object
  // ---------------------------------------------------------------------------
  [UIDS.VALIDATE_EXCLUSIVE_KEYS]: exclusiveKeysMessage,
  [UIDS.VALIDATE_REQUIRED_KEYS]: requiredKeysMessage,
  [UIDS.VALIDATE_WHITELISTED_KEYS]: whitelistedKeysMessage,

  // ---------------------------------------------------------------------------
  // Other
  // ---------------------------------------------------------------------------
  [UIDS.VALIDATE_IS_WHITELISTED_VALUE]: isWhitelistedValueMessage,
  [UIDS.VALIDATE_IS_NOT_BLACKLISTED_VALUE]: isNotBlacklistedValueMessage,
  [UIDS.VALIDATE_IS_NUMBER_WITH_UNIT]: isNumberWithUnitMessage,
  [UIDS.VALIDATE_IS_VALID_NON_NEGATIVE_NUMBER_WITH_UNIT]: isNonNegativeNumberWithUnitMessage,
  [UIDS.VALIDATE_IS_VALID_POSITIVE_NUMBER_WITH_UNIT]: isPositiveNumberWithUnitMessage,
}

export default messageMap
