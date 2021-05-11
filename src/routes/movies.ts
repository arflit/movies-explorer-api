import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getMovies, createMovie, deleteMovie,
} from '../controllers/movies';

const moviesRouter = Router();

moviesRouter.get('/', getMovies);
moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2),
    image: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
    trailer: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
    thumbnail: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(30),
    nameEN: Joi.string().required().min(2).max(30),
  }),
}), createMovie);
moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

export { moviesRouter };
