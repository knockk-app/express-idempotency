"use strict";
// Copyright (c) Ville de Montreal. All rights reserved.
// Licensed under the MIT license.
// See LICENSE file in the project root for full license information.
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
exports.InMemoryDataAdapter = void 0;
/**
 * In memory data adapter is basically a map which store keys
 * and the associated resource.
 * Not great for production grade API. Should use a more adequate adapter.
 */
class InMemoryDataAdapter {
    constructor() {
        // Resource storage
        this.idempotencyResources = [];
    }
    findByIdempotencyKey(idempotencyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.idempotencyResources.filter((value) => {
                return value.idempotencyKey === idempotencyKey;
            });
            if (result.length === 0) {
                return null;
            }
            return result[0];
        });
    }
    create(idempotencyResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield this.findByIdempotencyKey(idempotencyResource.idempotencyKey);
            if (resource) {
                throw new Error('Duplicate');
            }
            this.idempotencyResources.push(idempotencyResource);
        });
    }
    update(idempotencyResource) {
        return __awaiter(this, void 0, void 0, function* () {
            const findIndex = this.idempotencyResources.findIndex((x) => x.idempotencyKey === idempotencyResource.idempotencyKey);
            this.idempotencyResources[findIndex] = idempotencyResource;
        });
    }
    delete(idempotencyKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const findIndex = this.idempotencyResources.findIndex((x) => x.idempotencyKey === idempotencyKey);
            if (findIndex >= 0) {
                this.idempotencyResources.splice(findIndex, 1);
            }
        });
    }
}
exports.InMemoryDataAdapter = InMemoryDataAdapter;
