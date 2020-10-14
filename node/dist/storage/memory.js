"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStorage = void 0;
class InMemoryStorage {
    constructor() {
        this.map = {};
    }
    put(key, value) {
        const oldValue = this.get(key);
        this.map[key] = value;
        return oldValue;
    }
    get(key) {
        let value = this.map[key];
        if (value === undefined) {
            value = null;
        }
        return value;
    }
    clear() {
        this.map = {};
    }
    getAll() {
        return this.map;
    }
    save() {
        throw new Error('Method not implemented.');
    }
    load() {
        throw new Error('Method not implemented.');
    }
}
exports.InMemoryStorage = InMemoryStorage;
