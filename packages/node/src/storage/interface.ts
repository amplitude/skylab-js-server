export interface Storage {
  put(key: string, value: string): string;
  get(key: string): string;
  clear(): void;
  getAll(): Record<string, string>;
  save();
  load();
}
