/**
 * @category Types
 */
export type Variant = {
  /**
   * The value of the variant determined by the flag configuration
   */
  key: string;

  /**
   * The attached payload, if any
   */
  payload?: any;
}

export type Variants = {
  [flagKey: string]: Variant
}
