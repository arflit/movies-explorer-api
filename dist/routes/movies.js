"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moviesRouter = void 0;
var express_1 = require("express");
var celebrate_1 = require("celebrate");
var movies_1 = require("../controllers/movies");
var moviesRouter = express_1.Router();
exports.moviesRouter = moviesRouter;
moviesRouter.get('/', movies_1.getMovies);
moviesRouter.post('/', celebrate_1.celebrate({
    body: celebrate_1.Joi.object().keys({
        country: celebrate_1.Joi.string().required().min(2).max(30),
        director: celebrate_1.Joi.string().required().min(2).max(30),
        duration: celebrate_1.Joi.number().required(),
        year: celebrate_1.Joi.string().required().min(4).max(4),
        description: celebrate_1.Joi.string().required().min(2),
        image: celebrate_1.Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
        trailer: celebrate_1.Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
        thumbnail: celebrate_1.Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
        movieId: celebrate_1.Joi.number().required(),
        nameRU: celebrate_1.Joi.string().required().min(2).max(30),
        nameEN: celebrate_1.Joi.string().required().min(2).max(30),
    }),
}), movies_1.createMovie);
moviesRouter.delete('/:movieId', celebrate_1.celebrate({
    params: celebrate_1.Joi.object().keys({
        movieId: celebrate_1.Joi.string().hex().length(24),
    }),
}), movies_1.deleteMovie);
