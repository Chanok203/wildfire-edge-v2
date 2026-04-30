"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadRequestError = exports.NotFoundError = void 0;
class NotFoundError extends Error {
    statusCode = 404;
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends Error {
    statusCode = 400;
    constructor(message) {
        super(message);
        this.name = 'BadRequest';
    }
}
exports.BadRequestError = BadRequestError;
//# sourceMappingURL=error.utils.js.map