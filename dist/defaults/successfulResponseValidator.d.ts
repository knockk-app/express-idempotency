import { IIdempotencyResponseValidator, IdempotencyResponse } from '../models/models';
/**
 * Implementation of response validator.
 * Check for successful responses.
 */
export declare class SuccessfulResponseValidator implements IIdempotencyResponseValidator {
    /**
     * Check if the response is in the 2XX status code range and if it is, persist it.
     * @param idempotencyResponse Response to validate
     * @returns Indicate if need to persist
     */
    isValidForPersistence(idempotencyResponse: IdempotencyResponse): boolean;
}
