"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var movieSchema = new mongoose_1.default.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
            },
            message: 'передан некорректный URL изображения постера',
        },
    },
    trailer: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
            },
            message: 'передан некорректный URL трейлера ',
        },
    },
    thumbnail: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
            },
            message: 'передан некорректный URL изображения постера',
        },
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    movieId: {
        type: String,
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
});
exports.Movie = mongoose_1.default.model('movie', movieSchema);
