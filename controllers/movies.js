const Movie = require('../models/movie');

const ErrorWithStatusCode = require('../middlewares/error-with-status-code');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
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

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new ErrorWithStatusCode(404, 'Карточка не найдена');
      }
      if (!movie.owner.equals(req.user._id)) {
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
