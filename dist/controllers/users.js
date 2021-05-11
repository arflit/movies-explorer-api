"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserInfo = exports.getUserInfo = exports.signOut = exports.login = exports.createUser = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var user_1 = require("../models/user");
var error_with_status_code_1 = require("../middlewares/error-with-status-code");
var _a = process.env.JWT_SECRET, JWT_SECRET = _a === void 0 ? 'dev-secret' : _a;
var createUser = function (req, res, next) {
    var _a = req.body, name = _a.name, email = _a.email, password = _a.password;
    bcryptjs_1.default.hash(password, 10)
        .then(function (hash) { return user_1.User.create({
        name: name, email: email,
        password: hash,
    }); })
        .then(function (user) { return user_1.User.findById(user._id); })
        .then(function (user) { return res.send(user); })
        .catch(function (err) {
        if (err.name === 'ValidationError') {
            next(new error_with_status_code_1.ErrorWithStatusCode(400, err.message));
        }
        if (err.name === 'MongoError' && err.code === 11000) {
            next(new error_with_status_code_1.ErrorWithStatusCode(409, 'Пользователь с таким email уже зарегистрирован'));
        }
        next(err);
    });
};
exports.createUser = createUser;
var login = function (req, res, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    return user_1.User.findUserByCredentials(email, password)
        .then(function (user) { return user_1.User.findById(user._id); })
        .then(function (user) {
        if (!user) {
            throw new error_with_status_code_1.ErrorWithStatusCode(500, 'ошибка сервера');
        }
        var token = jsonwebtoken_1.default.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res
            .cookie('jwt', token, {
            maxAge: 604800000,
            httpOnly: true,
        })
            .status(200)
            .send(user)
            .end();
    })
        .catch(next);
};
exports.login = login;
var signOut = function (req, res) {
    res.clearCookie('jwt').send({ massege: 'cookie удалена!' });
};
exports.signOut = signOut;
var getUserInfo = function (req, res, next) {
    user_1.User.findById(req.user)
        .orFail(new error_with_status_code_1.ErrorWithStatusCode(404, 'Пользователь не найден'))
        .then(function (user) { return res.send(user); })
        .catch(next);
};
exports.getUserInfo = getUserInfo;
var updateUserInfo = function (req, res, next) {
    var _a = req.body, name = _a.name, email = _a.email;
    if (req.user === undefined) {
        throw new error_with_status_code_1.ErrorWithStatusCode(500, 'ошибка сервера');
    }
    user_1.User.findByIdAndUpdate(req.user._id, { name: name, email: email }, { runValidators: true, new: true })
        .then(function (user) { return res.send(user); })
        .catch(function (err) {
        if (err.name === 'ValidationError') {
            next(new error_with_status_code_1.ErrorWithStatusCode(400, err.message));
        }
        if (err.path === '_id') {
            next(new error_with_status_code_1.ErrorWithStatusCode(404, 'Пользователь не найден'));
        }
        if (err.name === 'MongoError' && err.code === 11000) {
            next(new error_with_status_code_1.ErrorWithStatusCode(409, 'Пользователь с таким email уже зарегистрирован'));
        }
        next(err);
    });
};
exports.updateUserInfo = updateUserInfo;
