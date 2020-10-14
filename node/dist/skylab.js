"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skylab = void 0;
const config_1 = require("./config");
const skylabClient_1 = require("./skylabClient");
const http_1 = require("./transport/http");
const normalize_1 = require("./util/normalize");
const instances = {};
const init = (apiKey, config) => {
    const normalizedName = normalize_1.normalizeInstanceName((config === null || config === void 0 ? void 0 : config.instanceName) || config_1.Defaults.INSTANCE_NAME);
    if (!instances[normalizedName]) {
        instances[normalizedName] = new skylabClient_1.SkylabClient(normalizedName, apiKey, config, http_1.fetchHttpClient);
    }
    return instances[normalizedName];
};
const getInstance = (name = config_1.Defaults.INSTANCE_NAME) => {
    const normalizedName = normalize_1.normalizeInstanceName(name);
    return instances[normalizedName];
};
exports.Skylab = {
    init,
    getInstance,
};
