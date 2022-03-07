"use strict";
// Copyright (c) Ville de Montreal. All rights reserved.
// Licensed under the MIT license.
// See LICENSE file in the project root for full license information.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessfulResponseValidator = void 0;
/**
 * Implementation of response validator.
 * Check for successful responses.
 */
class SuccessfulResponseValidator {
    /**
     * Check if the response is in the 2XX status code range and if it is, persist it.
     * @param idempotencyResponse Response to validate
     * @returns Indicate if need to persist
     */
    isValidForPersistence(idempotencyResponse) {
        return (idempotencyResponse.statusCode >= 200 &&
            idempotencyResponse.statusCode <= 299);
    }
}
exports.SuccessfulResponseValidator = SuccessfulResponseValidator;
