export const SkylabUserFields = {
  ID: 'id',
  USER_ID: 'user_id',
  DEVICE_ID: 'device_id',
  COUNTRY: 'country',
  REGION: 'region',
  CITY: 'city',
  LANGUAGE: 'language',
  PLATFORM: 'platform',
  VERSION: 'version',
  DEVICE_FAMILY: 'device_family',
  DEVICE_TYPE: 'device_type',
  USER_PROPERTIES: 'user_properties',
};

export type SkylabUser = {
  id?: string;
  device_id?: string;
  user_id?: string;
  country?: string;
  city?: string;
  region?: string;
  language?: string;
  platform?: string;
  version?: string;
  device_family?: string;
  device_type?: string;
  user_properties?: {
    [propertyName: string]:
      | string
      | number
      | boolean
      | Array<string | number | boolean>;
  };
};
