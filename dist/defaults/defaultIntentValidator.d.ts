import { IIdempotencyIntentValidator } from './../models/models';
import { IdempotencyRequest } from '../models/models';
import * as express from 'express';
/**
 * This is the default implementation of the intent validator.
 * It basically check only the request address to see if it is corresponding.
 */
export declare class DefaultIntentValidator implements IIdempotencyIntentValidator {
    /**
     * Check if the original and current request url is the same.
     * @param req request to validate
     * @param idempotencyRequest original request which created the idempotency resource
     */
    isValidIntent(req: express.Request, idempotencyRequest: IdempotencyRequest): boolean;
}
