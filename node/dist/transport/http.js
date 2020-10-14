"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHttpClient = void 0;
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const querystring_1 = __importDefault(require("querystring"));
const url_1 = __importDefault(require("url"));
const request = (requestUrl, method, headers, data) => {
    const urlParams = url_1.default.parse(requestUrl);
    if (method === 'GET' && data) {
        urlParams.path = `${urlParams.path}?${querystring_1.default.encode(data)}`;
    }
    const options = Object.assign(Object.assign({}, urlParams), { method,
        headers });
    return new Promise((resolve, reject) => {
        const protocol = urlParams.protocol === 'http:' ? http_1.default : https_1.default;
        const req = protocol.request(options, (res) => {
            res.setEncoding('utf-8');
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(responseBody));
            });
        });
        req.on('error', reject);
        if (method !== 'GET' && data) {
            req.write(data);
        }
        req.end();
    });
};
exports.fetchHttpClient = {
    request,
};
