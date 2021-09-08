"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var users_1 = require("./users");
var movies_1 = require("./movies");
var users_2 = require("../controllers/users");
var auth_1 = require("../middlewares/auth");
var errors_handler_1 = require("../middlewares/errors-handler");
var error_with_status_code_1 = require("../middlewares/error-with-status-code");
var logger_1 = require("../middlewares/logger");
var router = express_1.Router();
exports.router = router;
router.use(logger_1.requestLogger);
router.post('/signin', celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required().min(6),
    }),
}), users_2.login);
router.post('/signup', celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        email: celebrate_1.Joi.string().required().email(),
        password: celebrate_1.Joi.string().required().min(8),
        name: celebrate_1.Joi.string().min(2).max(30),
    }),
}), users_2.createUser);
router.post('/signout', auth_1.auth, users_2.signOut);
router.use('/users', auth_1.auth, users_1.usersRouter);
router.use('/movies', auth_1.auth, movies_1.moviesRouter);
router.use('*', function (req, res, next) {
    next(new error_with_status_code_1.ErrorWithStatusCode(404, 'Страница не найдена'));
});
router.use(logger_1.errorLogger);
router.use(celebrate_1.errors());
router.use(errors_handler_1.errorsHandler);
