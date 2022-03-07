"use strict";
// Copyright (c) Ville de Montreal. All rights reserved.
// Licensed under the MIT license.
// See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotency = exports.getSharedIdempotencyService = exports.ERROR_MSG_NOT_INITIALIZED = void 0;
const idempotencyService_1 = require("../services/idempotencyService");
exports.ERROR_MSG_NOT_INITIALIZED = 'Idempotency service has not been initialized by the middleware.';
// Keep a single instance of the service
let idempotencyService = null;
function getSharedIdempotencyService() {
    if (idempotencyService) {
        return idempotencyService;
    }
    throw new Error(exports.ERROR_MSG_NOT_INITIALIZED);
}
exports.getSharedIdempotencyService = getSharedIdempotencyService;
/**
 * Return a function used as a express middleware.
 */
exports.idempotency = (options) => {
    idempotencyService = new idempotencyService_1.IdempotencyService(options);
    return idempotencyService.provideMiddlewareFunction;
};
