export type SkylabUser = {
  id?: string;
  device_id?: string;
  user_id?: string;
  version?: string;
  country?: string;
  city?: string;
  region?: string;
  language?: string;
  platform?: string;
  user_properties?: {
    [propertyName: string]:
      | string
      | number
      | boolean
      | Array<string | number | boolean>;
  };
};
