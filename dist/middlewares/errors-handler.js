"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsHandler = void 0;
var errorsHandler = function (err, req, res, next) {
    var _a = err.statusCode, statusCode = _a === void 0 ? 500 : _a, _b = err.message, message = _b === void 0 ? 'На сервере произошла ошибка' : _b;
    res
        .status(statusCode)
        .send({
        message: message,
    });
    next();
};
exports.errorsHandler = errorsHandler;
