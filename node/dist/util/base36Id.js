"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.base36Id = void 0;
const base36Chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
const ID_LENGTH = 25;
const base36Id = () => {
    let str = '';
    for (let i = 0; i < ID_LENGTH; ++i) {
        str += base36Chars.charAt(Math.floor(Math.random() * 36));
    }
    return str;
};
exports.base36Id = base36Id;
