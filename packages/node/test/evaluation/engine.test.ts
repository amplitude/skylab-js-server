import {
  evaluate,
  userMatchesSegmentConditions,
  getVariantBasedOnRollout,
  getHash,
} from './../../src/evaluation/engine';

test('Empty Flag Configs', () => {
  expect(evaluate([], null)).toStrictEqual({});
});

test('Verify Inclusion Logic', () => {
  // everyone should get 'B' by default, user with 'id-1' should get 'A'
  const flagConfig = {
    flagKey: 'flag-1',
    variantKeys: ['A', 'B', 'C'],
    bucketingSalt: 'abcdef',
    defaultValue: null,
    enabled: true,
    inclusions: {
      A: ['id-1'],
    },
    allUsersTargetingConfig: {
      name: 'does-not-matter',
      bucketingKey: 'id',
      conditions: [],
      percentage: 100,
      rolloutWeights: {
        B: 1,
      },
    },
    customSegmentTargetingConfigs: [],
  };

  expect(
    evaluate([flagConfig], {
      id: 'id-1',
    }),
  ).toStrictEqual({ 'flag-1': 'A' });

  expect(
    evaluate([flagConfig], {
      id: 'id-2',
    }),
  ).toStrictEqual({ 'flag-1': 'B' });
});

test('User Matches Custom Segment Filters', () => {
  // return true if (country is Canada or Italy) and platform is iPhone
  const conditions = [
    { prop: 'country', op: 'IS', values: ['Canada', 'Italy'] },
    { prop: 'platform', op: 'IS_NOT', values: ['iPhone'] },
  ];

  expect(userMatchesSegmentConditions(conditions, { id: 'id-1' })).toBe(false);
  expect(
    userMatchesSegmentConditions(conditions, { id: 'id-1', country: 'Canada' }),
  ).toBe(false);
  expect(
    userMatchesSegmentConditions(conditions, {
      id: 'id-1',
      country: 'Canada',
      platform: 'android',
    }),
  ).toBe(true);
  expect(
    userMatchesSegmentConditions(conditions, {
      id: 'id-1',
      country: 'Italy',
      platform: 'android',
    }),
  ).toBe(true);
  expect(
    userMatchesSegmentConditions(conditions, {
      id: 'id-1',
      country: 'Canada',
      platform: 'iPhone',
    }),
  ).toBe(false);
});

test('Get Variant Based on Rollout', () => {
  const variantKeys = ['A', 'B', 'C'];
  const percentage = 100;
  const rolloutWeights = { A: 1, B: 1000000000 };

  expect(
    getVariantBasedOnRollout(
      variantKeys,
      'id',
      'ysG5w3B3',
      percentage,
      rolloutWeights,
      null,
      {},
    ),
  ).toBe(null);

  expect(
    getVariantBasedOnRollout(
      variantKeys,
      'id',
      'ysG5w3B3',
      percentage,
      rolloutWeights,
      null,
      { id: 'id-1' },
    ),
  ).toBe('B');
});

test('Get Hash', () => {
  expect(getHash('My hovercraft is full of eels.')).toBe(2953494853);
  expect(getHash('My 🚀 is full of 🦎.')).toBe(1818098979);
  expect(getHash('吉 星 高 照')).toBe(3435142074);
});

test('Eval Custom Targeting Segment', () => {
  // everyone in segment 1 (country = 'Canada') gets 'B'
  // everyone in segment 1 (country = 'Canada') gets 'C'
  // everyone else gets 'A'
  const flagConfig = {
    flagKey: 'flag-1',
    variantKeys: ['A', 'B', 'C'],
    bucketingSalt: 'abcdef',
    defaultValue: null,
    enabled: true,
    inclusions: {},
    allUsersTargetingConfig: {
      name: 'does-not-matter',
      bucketingKey: 'user_id',
      conditions: [],
      percentage: 100,
      rolloutWeights: {
        A: 1,
      },
    },
    customSegmentTargetingConfigs: [
      {
        name: 'does-not-matter',
        bucketingKey: 'user_id',
        conditions: [{ prop: 'country', op: 'IS', values: ['Canada'] }],
        percentage: 100,
        rolloutWeights: {
          B: 1,
        },
      },
      {
        name: 'does-not-matter',
        bucketingKey: 'user_id',
        conditions: [{ prop: 'platform', op: 'IS', values: ['android'] }],
        percentage: 100,
        rolloutWeights: {
          C: 1,
        },
      },
    ],
  };

  // no user properties, so fails to match custom segment filters
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
    }),
  ).toStrictEqual({ 'flag-1': 'A' });

  // country = "Canada", gets segment 1 config which returns "B"
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
      country: 'Canada',
    }),
  ).toStrictEqual({ 'flag-1': 'B' });

  // platform = "android", gets segment 2 config which returns "C"
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
      platform: 'android',
    }),
  ).toStrictEqual({ 'flag-1': 'C' });

  // mismatch country and matches platform (2nd segment)
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
      country: 'Italy',
      platform: 'android',
    }),
  ).toStrictEqual({ 'flag-1': 'C' });

  // matches both segments, first one is returned
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
      country: 'Canada',
      platform: 'android',
    }),
  ).toStrictEqual({ 'flag-1': 'B' });

  // has properties, but doesn't match both segments, ALL_USERS_SEGMENT info is returned
  expect(
    evaluate([flagConfig], {
      user_id: 'id-1',
      country: 'France',
      platform: 'iPhone',
    }),
  ).toStrictEqual({ 'flag-1': 'A' });
});

test('Eval Multiple Flag Configs', () => {
  // everyone gets 'A'
  const flagConfig1 = {
    flagKey: 'test-evaluate-flag-1',
    variantKeys: ['A', 'B', 'C'],
    bucketingSalt: 'abcdef',
    defaultValue: 'default-value',
    enabled: true,
    inclusions: {},
    allUsersTargetingConfig: {
      name: 'does-not-matter',
      bucketingKey: 'user_id',
      conditions: [],
      percentage: 100,
      rolloutWeights: {
        A: 1,
      },
    },
    customSegmentTargetingConfigs: [],
  };
  const flagConfig2 = {
    flagKey: 'test-evaluate-flag-2',
    variantKeys: ['A', 'B', 'C'],
    bucketingSalt: 'abcdef',
    defaultValue: 'default-value',
    enabled: false,
    inclusions: {},
    allUsersTargetingConfig: {
      name: 'does-not-matter',
      bucketingKey: 'user_id',
      conditions: [],
      percentage: 100,
      rolloutWeights: {},
    },
    customSegmentTargetingConfigs: [],
  };

  expect(
    evaluate([flagConfig1, flagConfig2], {
      user_id: 'id-1',
      country: 'Canada',
      platform: 'android',
    }),
  ).toStrictEqual({
    'test-evaluate-flag-1': 'A',
    'test-evaluate-flag-2': 'default-value',
  });
});
