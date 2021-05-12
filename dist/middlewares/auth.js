"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var error_with_status_code_1 = require("./error-with-status-code");
var _a = process.env.JWT_SECRET, JWT_SECRET = _a === void 0 ? 'dev-secret' : _a;
var auth = function (req, res, next) {
    if (!req.cookies.jwt) {
        return next(new error_with_status_code_1.ErrorWithStatusCode(401, 'Необходима авторизация'));
    }
    var token = req.cookies.jwt;
    var payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (err) {
        return next(new error_with_status_code_1.ErrorWithStatusCode(401, 'Необходима авторизация'));
    }
    req.user = payload; // записываем пейлоуд в объект запроса
    return next(); // пропускаем запрос дальше
};
exports.auth = auth;
