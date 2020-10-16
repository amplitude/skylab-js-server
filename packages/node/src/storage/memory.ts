import { Storage } from '../types/storage';

export class InMemoryStorage implements Storage {
  protected map: { [flagKey: string]: string } = {};

  put(key: string, value: string): string {
    const oldValue: string = this.get(key);
    this.map[key] = value;
    return oldValue;
  }
  get(key: string): string {
    let value = this.map[key];
    if (value === undefined) {
      value = null;
    }
    return value;
  }
  clear(): void {
    this.map = {};
  }

  getAll(): { [flagKey: string]: string } {
    return this.map;
  }

  save(): void {
    throw new Error('Method not implemented.');
  }
  load(): void {
    throw new Error('Method not implemented.');
  }
}
