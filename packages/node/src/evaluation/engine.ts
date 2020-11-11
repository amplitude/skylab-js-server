import MurmurHash3 from 'murmurhash3js-revisited';

import { FlagConfig, RolloutWeight, SegmentCondition } from '../flagConfig';
import { SkylabUser, SkylabUserFields } from '../user';
import { getUtf8Bytes } from '../util/encode';

import { StringMatchFilter } from './stringMatchFilter';

const MAX_HASH_VALUE = 4294967295;
const MAX_VARIANT_HASH_VALUE = Math.floor(MAX_HASH_VALUE / 100);
const DEFAULT_BUCKETING_KEY = 'id';

const evaluate = (
  flagConfigs: FlagConfig[],
  user: SkylabUser,
): Record<string, string> => {
  const result = {};
  for (const flagConfig of flagConfigs) {
    result[flagConfig.flagKey] = evaluateFlag(flagConfig, user);
  }
  return result;
};

const evaluateFlag = (flagConfig: FlagConfig, user: SkylabUser): string => {
  if (!flagConfig.enabled) {
    return flagConfig.defaultValue;
  }

  if (user == null) {
    return flagConfig.defaultValue;
  }

  // check for inclusions
  const uniqueIdForUser = getUniqueIdFromUser(user);
  if (uniqueIdForUser != null) {
    if (flagConfig.inclusions != null) {
      for (const variantKey of Object.keys(flagConfig.inclusions)) {
        const includedIdsForVariantKey = flagConfig.inclusions[variantKey];
        if (includedIdsForVariantKey.includes(uniqueIdForUser)) {
          return variantKey;
        }
      }
    }
  }

  // check if we have any custom targeting segments
  if (
    flagConfig.customSegmentTargetingConfigs != null &&
    flagConfig.customSegmentTargetingConfigs.length > 0
  ) {
    for (const segmentTargetingConfig of flagConfig.customSegmentTargetingConfigs) {
      if (
        !userMatchesSegmentConditions(segmentTargetingConfig.conditions, user)
      ) {
        continue;
      }

      const variantKey = getVariantBasedOnRollout(
        flagConfig.variantKeys,
        segmentTargetingConfig.bucketingKey,
        flagConfig.bucketingSalt,
        segmentTargetingConfig.percentage,
        segmentTargetingConfig.rolloutWeights,
        flagConfig.defaultValue,
        user,
      );

      return variantKey;
    }
  }

  return getVariantBasedOnRollout(
    flagConfig.variantKeys,
    flagConfig.allUsersTargetingConfig.bucketingKey,
    flagConfig.bucketingSalt,
    flagConfig.allUsersTargetingConfig.percentage,
    flagConfig.allUsersTargetingConfig.rolloutWeights,
    flagConfig.defaultValue,
    user,
  );
};

const getHash = (key: string): number => {
  return MurmurHash3.x86.hash32(getUtf8Bytes(key));
};

const getVariantBasedOnRollout = (
  variantKeys: string[],
  bucketingKey: string,
  bucketingSalt: string,
  percentage: number,
  rolloutWeights: RolloutWeight,
  defaultValue: string,
  user: SkylabUser,
): string => {
  if (bucketingKey == null) {
    bucketingKey = DEFAULT_BUCKETING_KEY;
  }

  const bucketingKeyForUser = getBucketingKeyForUser(user, bucketingKey);

  if (bucketingKeyForUser == null || bucketingKeyForUser == '') {
    return defaultValue;
  }

  const bucketingValue = `${bucketingSalt}/${bucketingKeyForUser || ''}`;
  const hash = getHash(bucketingValue);
  const bucket = hash % 100;
  const variantHash = Math.floor(hash / 100);
  const distribution = getVariantDistributionForSegment(
    variantKeys,
    percentage,
    rolloutWeights,
  );

  if (bucket < percentage && distribution.length > 0) {
    // rolled out, serve the appropriate variant
    let upperBound = 0;
    for (const slice of distribution) {
      if (slice.pct) {
        upperBound = slice.cumulativePct * MAX_VARIANT_HASH_VALUE;
        if (variantHash < upperBound) {
          return slice.key;
        }
      }
    }
  }

  return defaultValue;
};

const getVariantDistributionForSegment = (
  variantKeys: string[],
  percentage: number,
  rolloutWeights: RolloutWeight,
) => {
  const distribution = [];
  let totalWeight = 0;
  if (!variantKeys) {
    return distribution;
  }
  for (const variantKey of variantKeys) {
    const rolloutWeight = rolloutWeights?.[variantKey];
    if (rolloutWeight) {
      totalWeight += rolloutWeight;
    }
  }
  if (totalWeight === 0) {
    // if everything is 0, evenly weight
    for (const [i, variantKey] of variantKeys.entries()) {
      const pct = 1 / variantKeys.length;
      const cumulativePct = (i + 1) / variantKeys.length;
      distribution.push({ key: variantKey, pct, cumulativePct });
    }
  } else {
    let cumulativeWeight = 0;
    let cumulativePct = 0;
    for (const variantKey of variantKeys) {
      let pct = 0;
      const rolloutWeight = rolloutWeights?.[variantKey];
      if (rolloutWeight) {
        cumulativeWeight += rolloutWeight;
        pct = rolloutWeight / totalWeight;
        cumulativePct = cumulativeWeight / totalWeight;
      }
      distribution.push({ key: variantKey, pct, cumulativePct });
    }
  }

  return distribution;
};

const getBucketingKeyForUser = (
  user: SkylabUser,
  bucketingKeyField: string,
): string => {
  switch (bucketingKeyField) {
    case SkylabUserFields.ID:
      return user.id;
    case SkylabUserFields.USER_ID:
      return user.user_id;
    case SkylabUserFields.DEVICE_ID:
      return user.device_id;
    case 'amplitude_id':
    default:
      // not supported in js server SDK. Maybe, raise exception?
      return null;
  }
};

const userMatchesSegmentConditions = (
  conditions: SegmentCondition[],
  user: SkylabUser,
): boolean => {
  if (conditions == null || conditions.length == 0) {
    return true;
  }

  for (const condition of conditions) {
    if (!userMatchesCondition(condition, user)) {
      // if the user does not match even a single condition, return false
      return false;
    }
  }

  return true;
};

const userMatchesCondition = (
  condition: SegmentCondition,
  user: SkylabUser,
): boolean => {
  const userPropValue = getPropertyFromSkylabUser(user, condition.prop);
  if (userPropValue == null) {
    return false;
  }

  const matchFilter = new StringMatchFilter(condition.op, condition.values);
  return matchFilter.matches(String(userPropValue));
};

const getPropertyFromSkylabUser = (user: SkylabUser, propertyKey: string) => {
  // custom properties start with 'gp:'
  if (propertyKey.startsWith('gp:')) {
    propertyKey = propertyKey.substring(3);
    // if the user_properties is null or the property key is not present, return null
    if (
      user.user_properties == null ||
      !(propertyKey in user.user_properties)
    ) {
      return null;
    }
    return user.user_properties[propertyKey];
  }

  switch (propertyKey) {
    case SkylabUserFields.ID:
      return user.id;
    case SkylabUserFields.USER_ID:
      return user.user_id;
    case SkylabUserFields.DEVICE_ID:
      return user.device_id;
    case SkylabUserFields.COUNTRY:
      return user.country;
    case SkylabUserFields.REGION:
      return user.region;
    case SkylabUserFields.CITY:
      return user.city;
    case SkylabUserFields.LANGUAGE:
      return user.language;
    case SkylabUserFields.PLATFORM:
      return user.platform;
    case SkylabUserFields.VERSION:
      return user.version;
    default:
      return null;
  }
};

const getUniqueIdFromUser = (user: SkylabUser): string => {
  if (user.id != null) {
    return user.id;
  }

  if (user.user_id != null) {
    return user.user_id;
  }

  if (user.device_id != null) {
    return user.device_id;
  }
};

// export non-'evaluate' functions for testing
export {
  evaluate,
  userMatchesSegmentConditions,
  getVariantBasedOnRollout,
  getHash,
};
