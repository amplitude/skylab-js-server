import { Storage } from './interface';
export declare class InMemoryStorage implements Storage {
    protected map: Record<string, string>;
    put(key: string, value: string): string;
    get(key: string): string;
    clear(): void;
    getAll(): Record<string, string>;
    save(): void;
    load(): void;
}
