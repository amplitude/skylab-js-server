"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkylabClient = void 0;
const perf_hooks_1 = require("perf_hooks");
const config_1 = require("./config");
const memory_1 = require("./storage/memory");
const base64_1 = require("./util/base64");
class SkylabClient {
    constructor(instanceName, apiKey, config, httpClient) {
        this.instanceName = instanceName;
        this.apiKey = apiKey;
        this.httpClient = httpClient;
        this.config = config;
        this.serverUrl = (config === null || config === void 0 ? void 0 : config.serverUrl) || config_1.Defaults.SERVER_URL;
        this.storage = new memory_1.InMemoryStorage();
    }
    fetchAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apiKey === null) {
                return this;
            }
            try {
                const user = this.user;
                const userContext = Object.assign({}, user);
                const encodedContext = base64_1.urlSafeBase64Encode(JSON.stringify(userContext));
                const response = yield this.httpClient.request(`${this.serverUrl}/sdk/variants/${encodedContext}`, 'GET', { Authorization: `Api-Key ${this.apiKey}` });
                this.storage.clear();
                for (const flag of Object.keys(response)) {
                    this.storage.put(flag, response[flag]);
                }
            }
            catch (e) {
                console.error(e);
            }
            return this;
        });
    }
    getVariant(flagKey, fallback = config_1.Defaults.FALLBACK_VARIANT) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.apiKey === null) {
                return null;
            }
            const start = perf_hooks_1.performance.now();
            yield this.fetchAll();
            const variant = this.storage.get(flagKey) || fallback;
            const end = perf_hooks_1.performance.now();
            console.debug(`[Skylab] Fetched ${variant} for ${flagKey} in ${(end - start).toFixed(3)} ms`);
            return variant;
        });
    }
}
exports.SkylabClient = SkylabClient;
