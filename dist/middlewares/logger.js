"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
var winston_1 = __importDefault(require("winston"));
var express_winston_1 = __importDefault(require("express-winston"));
var requestLogger = express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.File({ filename: './logs/request.log' }),
    ],
    format: winston_1.default.format.json(),
});
exports.requestLogger = requestLogger;
var errorLogger = express_winston_1.default.errorLogger({
    transports: [
        new winston_1.default.transports.File({ filename: './logs/error.log' }),
    ],
    format: winston_1.default.format.json(),
});
exports.errorLogger = errorLogger;
