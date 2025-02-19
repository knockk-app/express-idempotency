import { Request } from 'express';
/**
 * Idempotency request.
 */
export interface IdempotencyRequest {
    body: any;
    headers: any;
    method: string;
    query: any;
    url: string;
}
/**
 * Idempotency response.
 * Keep a reference of the response (ex: http status) and the body.
 */
export declare class IdempotencyResponse {
    statusCode?: number;
    headers: any;
    body?: any;
}
/**
 * Idempotency resource.
 * Used to associate a idempotency key to its request and response.
 * Since we are in a REST context, expecting the body of the request and the response
 * to be of the same type.
 */
export interface IdempotencyResource {
    /**
     * The key which make the operation idempotent.
     */
    idempotencyKey: string;
    /**
     * The initial request. Can be used to validate that a subsequent
     * request if the same and the idempotency key is not misused.
     */
    request: IdempotencyRequest;
    /**
     * The response received from the operation and that will
     * be returned for a matching idempotency key.
     */
    response?: IdempotencyResponse;
}
/**
 * Interface for response validator implementation.
 */
export interface IIdempotencyResponseValidator {
    /**
     * Determine if the response is valid for persistance.
     * @param idempotencyResponse Response to validate
     * @returns Indicate if need to persist
     */
    isValidForPersistence(idempotencyResponse: IdempotencyResponse): boolean;
}
/**
 * Interface to implement for idempotency resource persistence.
 */
export interface IIdempotencyDataAdapter {
    /**
     * Find the resource for a specific idempotency key.
     * @param idempotencyKey Idempotency key
     * @returns Idempotency resource
     */
    findByIdempotencyKey(idempotencyKey: string): Promise<IdempotencyResource | null>;
    /**
     * Create a idempotency resource.
     * @param idempotencyResource Idempotency resource
     */
    create(idempotencyResource: IdempotencyResource): Promise<void>;
    /**
     * Update a idempotency resource.
     * @param idempotencyResource Idempotency resource
     */
    update(idempotencyResource: IdempotencyResource): Promise<void>;
    /**
     * Delete a idempotency resource.
     * @param idempotencyKey Resource to delete
     */
    delete(idempotencyKey: string): Promise<void>;
}
/**
 * Interface for intent validator implementation.
 * Used to check when a idempotency key is found, the intent of the request
 * is corresponding to the original request. This is to prevent idempotency key
 * to be use incorrectly.
 */
export interface IIdempotencyIntentValidator {
    /**
     * Valid the intent of the request.
     * @param req request to validate
     * @param idempotencyRequest orignal request which generate a idempotency resource
     */
    isValidIntent(req: Request, idempotencyRequest: IdempotencyRequest): boolean;
}
/**
 * Options available to configure the idempotency middleware.
 */
export interface IdempotencyOptions {
    idempotencyKeyHeader?: string;
    dataAdapter?: IIdempotencyDataAdapter;
    responseValidator?: IIdempotencyResponseValidator;
    intentValidator?: IIdempotencyIntentValidator;
}
