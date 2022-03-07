"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIntentValidator = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
/**
 * This is the default implementation of the intent validator.
 * It basically check only the request address to see if it is corresponding.
 */
class DefaultIntentValidator {
    /**
     * Check if the original and current request url is the same.
     * @param req request to validate
     * @param idempotencyRequest original request which created the idempotency resource
     */
    isValidIntent(req, idempotencyRequest) {
        // Compare original and current requests
        return (req.url === idempotencyRequest.url &&
            req.method === idempotencyRequest.method &&
            deep_equal_1.default(req.query, idempotencyRequest.query) &&
            deep_equal_1.default(req.body, idempotencyRequest.body));
    }
}
exports.DefaultIntentValidator = DefaultIntentValidator;
