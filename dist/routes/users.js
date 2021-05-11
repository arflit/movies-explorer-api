"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var users_1 = require("../controllers/users");
var usersRouter = express_1.Router();
exports.usersRouter = usersRouter;
usersRouter.get('/me', users_1.getUserInfo);
usersRouter.patch('/me', celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().required().min(2).max(30),
        email: celebrate_1.Joi.string().required().email(),
    }),
}), users_1.updateUserInfo);
