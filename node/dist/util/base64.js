"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.urlSafeBase64Encode = void 0;
const encode = (unencoded) => {
    return Buffer.from(unencoded || '').toString('base64');
};
exports.urlSafeBase64Encode = (s) => {
    const encoded = encode(s);
    return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};
