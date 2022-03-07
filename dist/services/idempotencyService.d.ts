import * as express from 'express';
import { IdempotencyOptions } from '../models/models';
/**
 * This class represent the idempotency service.
 * It contains all the logic.
 */
export declare class IdempotencyService {
    private _options;
    /**
     * Constructor, used to initialize default values if options are not provided.
     * @param options Options provided
     */
    constructor(options?: IdempotencyOptions);
    /**
     * Provide middleware function to enable idempotency.
     * @param req Express request
     * @param res Express response
     * @param next Express next function
     */
    provideMiddlewareFunction(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    /**
     * Verify if the request is idempotent and so, nothing should be done
     * in term of processing.
     * @param req Request to validate hit
     */
    isHit(req: express.Request): boolean;
    /**
     * Indicate that an error occurs during targeted process and idempotency must not occurs.
     * @param req Request to report in error
     */
    reportError(req: express.Request): Promise<void>;
    /**
     * Convert a request into a idempotency request which keeps only minimal representation.
     * @param req
     */
    private convertToIdempotencyRequest;
    /**
     * Extract idempotency key from request.
     * @param req
     */
    extractIdempotencyKeyFromReq(req: express.Request): string;
    /**
     * Override function, which is the correct way. But Typescript won't allow it because there is multiple overloads.
     * @param res
     * @param resource
     */
    private setupHooks;
    /**
     * Hook into writeHead function of response to receive the status code
     * and the headers.
     * @param res
     */
    private writeHeadHook;
    /**
     * Hook into send function of the response to receive the body.
     * @param res
     */
    private sendHook;
    /**
     * Build idempotency response from hook responses and the response itself.
     * @param res
     * @param statusCode
     * @param body
     */
    private buildIdempotencyResponse;
}
