"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.createMovie = exports.getMovies = void 0;
var movie_1 = require("../models/movie");
var error_with_status_code_1 = require("../middlewares/error-with-status-code");
var getMovies = function (req, res, next) {
    if (req.user === undefined) {
        throw new error_with_status_code_1.ErrorWithStatusCode(500, 'ошибка сервера');
    }
    movie_1.Movie.find({ owner: req.user._id })
        .then(function (movies) {
        res.send(movies);
    })
        .catch(next);
};
exports.getMovies = getMovies;
var createMovie = function (req, res, next) {
    var _a = req.body, country = _a.country, director = _a.director, duration = _a.duration, year = _a.year, description = _a.description, image = _a.image, trailer = _a.trailer, thumbnail = _a.thumbnail, movieId = _a.movieId, nameRU = _a.nameRU, nameEN = _a.nameEN;
    if (req.user === undefined) {
        throw new error_with_status_code_1.ErrorWithStatusCode(500, 'ошибка сервера');
    }
    movie_1.Movie.create({
        country: country,
        director: director,
        duration: duration,
        year: year,
        description: description,
        image: image,
        trailer: trailer,
        thumbnail: thumbnail,
        movieId: movieId,
        nameRU: nameRU,
        nameEN: nameEN,
        owner: req.user._id,
    })
        .then(function (movie) { return res.send(movie); })
        .catch(function (err) {
        if (err.name === 'ValidationError') {
            next(new error_with_status_code_1.ErrorWithStatusCode(400, err.message));
        }
        next(err);
    });
};
exports.createMovie = createMovie;
var deleteMovie = function (req, res, next) {
    movie_1.Movie.findById(req.params.movieId)
        .then(function (movie) {
        if (!movie) {
            throw new error_with_status_code_1.ErrorWithStatusCode(404, 'Фильм не найден');
        }
        if (req.user === undefined) {
            throw new error_with_status_code_1.ErrorWithStatusCode(500, 'ошибка сервера');
        }
        if (movie.owner.toString() !== req.user._id) {
            throw new error_with_status_code_1.ErrorWithStatusCode(403, 'Вы пытаетесь удалить фильм из чужой коллекции');
        }
        return movie;
    })
        .then(function (movie) {
        movie.remove();
    })
        .then(function () { return movie_1.Movie.find({}); })
        .then(function (movies) { return res.send(movies); })
        .catch(next);
};
exports.deleteMovie = deleteMovie;
