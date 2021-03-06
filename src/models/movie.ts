import mongoose, { Document } from 'mongoose';

export interface IMovie extends Document {
  owner: string;
}

const movieSchema = new mongoose.Schema({
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
      validator(v: string) {
        return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
      },
      message: 'передан некорректный URL изображения постера',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
      },
      message: 'передан некорректный URL трейлера ',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return /^(https?:\/\/)(www\.)?([\da-z-.]+)\.([a-z.]{2,6})[\da-zA-Z-._~:?#[\]@!$&'()*+,;=/]*\/?#?$/i.test(v);
      },
      message: 'передан некорректный URL изображения постера',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
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

export const Movie = mongoose.model<IMovie>('movie', movieSchema);
