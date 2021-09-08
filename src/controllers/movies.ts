import { RequestHandler } from 'express';
import { Movie } from '../models/movie';
import { ErrorWithStatusCode } from '../middlewares/error-with-status-code';

export const getMovies: RequestHandler = (req, res, next) => {
  if (req.user === undefined) {
    throw new ErrorWithStatusCode(500, 'ошибка сервера');
  }
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

export const createMovie: RequestHandler = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  if (req.user === undefined) {
    throw new ErrorWithStatusCode(500, 'ошибка сервера');
  }
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      next(err);
    });
};

export const deleteMovie: RequestHandler = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorWithStatusCode(404, 'Фильм не найден');
      }
      if (req.user === undefined) {
        throw new ErrorWithStatusCode(500, 'ошибка сервера');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new ErrorWithStatusCode(
          403,
          'Вы пытаетесь удалить фильм из чужой коллекции',
        );
      }
      return movie;
    })
    .then((movie) => {
      movie.remove();
    })
    .then(() => Movie.find({}))
    .then((movies) => res.send(movies))
    .catch(next);
};
