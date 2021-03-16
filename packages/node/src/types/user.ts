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
