export class StringMatchFilter {
  protected readonly operator: string;
  protected readonly values: string[];

  public constructor(operator: string, values: string[]) {
    this.operator = operator;
    this.values = values;
  }

  private matchesIs(value: string): boolean {
    return this.values.includes(value);
  }

  public matches(value: string): boolean {
    switch (this.operator) {
      case 'is':
        return this.matchesIs(value);
      case 'is_not':
        return !this.matchesIs(value);
      default:
        // TODO: not supported
        return false;
    }
    return false;
  }
}
