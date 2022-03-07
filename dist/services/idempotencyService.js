"use strict";
// Copyright (c) Ville de Montreal. All rights reserved.
// Licensed under the MIT license.
// See LICENSE file in the project root for full license information.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.IdempotencyService = void 0;
const autobind_decorator_1 = require("autobind-decorator");
const defaultIntentValidator_1 = require("./../defaults/defaultIntentValidator");
const HttpStatus = __importStar(require("http-status-codes"));
const inMemoryDataAdapter_1 = require("./../defaults/inMemoryDataAdapter");
const successfulResponseValidator_1 = require("./../defaults/successfulResponseValidator");
// Default values
const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';
const HIT_HEADER = 'x-hit';
const HIT_VALUE = 'true';
/**
 * This class represent the idempotency service.
 * It contains all the logic.
 */
let IdempotencyService = class IdempotencyService {
    /**
     * Constructor, used to initialize default values if options are not provided.
     * @param options Options provided
     */
    constructor(options = {}) {
        var _a, _b, _c, _d;
        // Default values or provided values
        const idempotencyKeyHeader = (_a = options.idempotencyKeyHeader) !== null && _a !== void 0 ? _a : IDEMPOTENCY_KEY_HEADER;
        const dataAdapter = (_b = options.dataAdapter) !== null && _b !== void 0 ? _b : new inMemoryDataAdapter_1.InMemoryDataAdapter();
        const responseValidator = (_c = options.responseValidator) !== null && _c !== void 0 ? _c : new successfulResponseValidator_1.SuccessfulResponseValidator();
        const intentValidator = (_d = options.intentValidator) !== null && _d !== void 0 ? _d : new defaultIntentValidator_1.DefaultIntentValidator();
        // Ensure that every propery has a value.
        this._options = {
            idempotencyKeyHeader,
            dataAdapter,
            responseValidator,
            intentValidator,
        };
    }
    /**
     * Provide middleware function to enable idempotency.
     * @param req Express request
     * @param res Express response
     * @param next Express next function
     */
    provideMiddlewareFunction(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the idempotency key to determine if there is something to process
            const idempotencyKey = this.extractIdempotencyKeyFromReq(req);
            if (idempotencyKey) {
                res.setHeader(this._options.idempotencyKeyHeader, idempotencyKey);
                // If there is already a resource associated to this idempotency key,
                // there will be 2 scenarios: the previous request is still in progress or there is
                // a response available.
                let resource = yield this._options.dataAdapter.findByIdempotencyKey(idempotencyKey);
                if (resource) {
                    // Indicate idempotency exists
                    req.headers[HIT_HEADER] = HIT_VALUE;
                    // Validate the intent before going any further. This is to avoid misuse of the
                    // idempotency key function. This could also lead to security vulnerability
                    // because someone could send random key to get response.
                    if (this._options.intentValidator.isValidIntent(req, resource.request)) {
                        const availableResponse = resource.response;
                        if (availableResponse) {
                            // Set original headers
                            for (const header of Object.keys(availableResponse.headers)) {
                                res.setHeader(header, availableResponse.headers[header]);
                            }
                            // Send saved response if available
                            res.status(availableResponse.statusCode).send(availableResponse.body);
                            next();
                        }
                        else {
                            // Previous request in progress
                            const conflictError = new Error('A previous request is still in progress for this key.');
                            res.status(HttpStatus.CONFLICT).send({
                                code: HttpStatus.CONFLICT,
                                message: conflictError.message,
                                payload: null,
                            });
                            next(conflictError);
                        }
                    }
                    else {
                        // Invalid intent. Client must correct his request.
                        const invalidIntentError = new Error('Misuse of the idempotency key. Please check your request.');
                        res.status(HttpStatus.EXPECTATION_FAILED).send({
                            code: HttpStatus.EXPECTATION_FAILED,
                            message: invalidIntentError.message,
                            payload: null,
                        });
                        next(invalidIntentError);
                    }
                }
                else {
                    // No resource, so initiate the idempotency process
                    resource = {
                        idempotencyKey,
                        request: this.convertToIdempotencyRequest(req),
                    };
                    yield this._options.dataAdapter.create(resource);
                    this.setupHooks(res, resource);
                    next();
                }
            }
            else {
                next();
            }
        });
    }
    /**
     * Verify if the request is idempotent and so, nothing should be done
     * in term of processing.
     * @param req Request to validate hit
     */
    isHit(req) {
        return req.get(HIT_HEADER) === HIT_VALUE;
    }
    /**
     * Indicate that an error occurs during targeted process and idempotency must not occurs.
     * @param req Request to report in error
     */
    reportError(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const idempotencyKey = this.extractIdempotencyKeyFromReq(req);
            yield this._options.dataAdapter.delete(idempotencyKey);
        });
    }
    /**
     * Convert a request into a idempotency request which keeps only minimal representation.
     * @param req
     */
    convertToIdempotencyRequest(req) {
        return {
            body: req.body,
            headers: req.headers,
            method: req.method,
            query: req.query,
            url: req.url,
        };
    }
    /**
     * Extract idempotency key from request.
     * @param req
     */
    extractIdempotencyKeyFromReq(req) {
        return req.get(this._options.idempotencyKeyHeader);
    }
    /**
     * Override function, which is the correct way. But Typescript won't allow it because there is multiple overloads.
     * @param res
     * @param resource
     */
    setupHooks(res, resource) {
        // Wait for all promise to come back. To ensure performance,
        // fire and forget.
        const idempotencyKey = resource.idempotencyKey;
        Promise.all([
            this.writeHeadHook(res),
            this.sendHook(res),
        ])
            .then(([[statusCode], body]) => __awaiter(this, void 0, void 0, function* () {
            // Receive everything required to assemble a idempotency response.
            // logger.info(headers);
            const response = this.buildIdempotencyResponse(res, statusCode, body);
            try {
                // Validate against conditions to determine if valid response
                if (this._options.responseValidator.isValidForPersistence(response)) {
                    const newResource = Object.assign(Object.assign({}, resource), { response });
                    yield this._options.dataAdapter.update(newResource);
                }
                else {
                    yield this._options.dataAdapter.delete(idempotencyKey);
                }
            }
            catch (err) {
                console.log('Error while validating response for persistence.');
                throw err;
            }
        }))
            .catch(() => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Something went wrong, try to remove idempotency...');
                yield this._options.dataAdapter.delete(idempotencyKey);
            }
            catch (err) {
                console.log('Error while removing idempotency key during failing hook.');
            }
        }));
    }
    /**
     * Hook into writeHead function of response to receive the status code
     * and the headers.
     * @param res
     */
    writeHeadHook(res) {
        return new Promise((resolve) => {
            const defaultWriteHead = res.writeHead.bind(res);
            // @ts-ignore
            res.writeHead = (statusCode, reasonPhrase, headers) => {
                resolve([statusCode, headers]);
                defaultWriteHead(statusCode, reasonPhrase, headers);
            };
        });
    }
    /**
     * Hook into send function of the response to receive the body.
     * @param res
     */
    sendHook(res) {
        return new Promise((resolve) => {
            const defaultSend = res.send.bind(res);
            // @ts-ignore
            res.send = (body) => {
                resolve(body);
                defaultSend(body);
            };
        });
    }
    /**
     * Build idempotency response from hook responses and the response itself.
     * @param res
     * @param statusCode
     * @param body
     */
    buildIdempotencyResponse(res, statusCode, body) {
        const headerWhitelist = ['content-type'];
        const preliminaryHeaders = res.getHeaders();
        // Keeps only whitelisted headers
        const headers = Object.keys(preliminaryHeaders)
            .filter((key) => headerWhitelist.includes(key))
            .reduce((obj, key) => {
            obj[key] = preliminaryHeaders[key];
            return obj;
        }, {});
        return {
            statusCode,
            body,
            headers,
        };
    }
};
IdempotencyService = __decorate([
    autobind_decorator_1.boundClass
], IdempotencyService);
exports.IdempotencyService = IdempotencyService;
