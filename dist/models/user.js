"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var error_with_status_code_1 = require("../middlewares/error-with-status-code");
var userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /[-.\w]+@([\w-]+\.)+[\w-]+/i.test(v);
            },
            message: 'передан некорректный адрес электронной почты',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
userSchema.statics.findUserByCredentials = function (email, password) {
    return this.findOne({ email: email }).select('+password')
        .then(function (user) {
        if (!user) {
            return Promise.reject(new error_with_status_code_1.ErrorWithStatusCode(401, 'Неправильные почта или пароль'));
        }
        return bcryptjs_1.default.compare(password, user.password)
            .then(function (matched) {
            if (!matched) {
                return Promise.reject(new error_with_status_code_1.ErrorWithStatusCode(401, 'Неправильные почта или пароль'));
            }
            return user;
        });
    });
};
exports.User = mongoose_1.default.model('user', userSchema);
