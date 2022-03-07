import * as express from 'express';
import { IdempotencyOptions } from '../models/models';
import { IdempotencyService } from '../services/idempotencyService';
export declare const ERROR_MSG_NOT_INITIALIZED = "Idempotency service has not been initialized by the middleware.";
declare type expressMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
export declare function getSharedIdempotencyService(): IdempotencyService;
/**
 * Return a function used as a express middleware.
 */
export declare const idempotency: (options?: IdempotencyOptions) => expressMiddleware;
export {};
