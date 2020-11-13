export type SegmentCondition = {
  prop: string;
  op: string;
  values: string[];
};

export type RolloutWeight = Record<string, number>;
export type Inclusion = Record<string, string[]>;

export type TargetingConfig = {
  name?: string;
  bucketingKey: string;
  conditions?: SegmentCondition[];
  percentage?: number;
  rolloutWeights?: RolloutWeight;
};

export type FlagConfig = {
  flagKey: string;
  variantKeys: string[];
  bucketingSalt: string;
  defaultValue?: string;
  enabled: boolean;
  inclusions?: Inclusion;
  allUsersTargetingConfig: TargetingConfig;
  customSegmentTargetingConfigs: TargetingConfig[];
};

/*
Example response from /sdk/rules
[
  {
    "allUsersTargetingConfig": {
      "bucketingKey": "id",
      "percentage": 0,
      "rolloutWeightsPerVariantKey": {
        "maybe": 1,
        "new-variant": 1,
        "true": 1
      },
      "segmentFilters": []
    },
    "bucketingKey": "id",
    "bucketingSalt": "togSMACq",
    "customSegmentTargetingConfigs": [
      {
        "bucketingKey": "id",
        "percentage": 100,
        "rolloutWeightsPerVariantKey": {
          "maybe": 1,
          "new-variant": 0,
          "true": 0
        },
        "segmentFilters": [
          {
            "op": "IS",
            "prop": "city",
            "values": [
              "San Francisco"
            ]
          }
        ]
      }
    ],
    "defaultValue": "false",
    "enabled": false,
    "flagKey": "test",
    "variantKeys": [
      "true",
      "maybe",
      "new-variant"
    ],
    "variantsExclusions": null,
    "variantsInclusions": null
  }
]
*/
