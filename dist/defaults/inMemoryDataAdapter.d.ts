import { IdempotencyResource, IIdempotencyDataAdapter } from '../models/models';
/**
 * In memory data adapter is basically a map which store keys
 * and the associated resource.
 * Not great for production grade API. Should use a more adequate adapter.
 */
export declare class InMemoryDataAdapter implements IIdempotencyDataAdapter {
    private idempotencyResources;
    findByIdempotencyKey(idempotencyKey: string): Promise<IdempotencyResource>;
    create(idempotencyResource: IdempotencyResource): Promise<void>;
    update(idempotencyResource: IdempotencyResource): Promise<void>;
    delete(idempotencyKey: string): Promise<void>;
}
