import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { ErrorWithStatusCode } from '../middlewares/error-with-status-code';
import { RequestHandler } from 'express';

const { JWT_SECRET = 'dev-secret' } = process.env;

export const createUser: RequestHandler = (req, res, next) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => User.findById(user._id))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ErrorWithStatusCode(409, 'Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

export const login: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => User.findById(user._id))
    .then((user) => {
      if (!user) {
        throw new ErrorWithStatusCode(500, 'ошибка сервера')
      }
      const token = jwt.sign({ _id: user._id }, JWT_SECRET,
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 604800000,
          httpOnly: true,
        })
        .status(200)
        .send(user)
        .end();
    })
    .catch(next);
};

export const signOut: RequestHandler = (req, res) => {
  res.clearCookie('jwt').send({ massege: 'cookie удалена!' });
};

export const getUserInfo: RequestHandler = (req, res, next) => {
  User.findById(req.user)
    .orFail(new ErrorWithStatusCode(404, 'Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

export const updateUserInfo: RequestHandler = (req, res, next) => {
  const { name, email } = req.body;
  if (req.user === undefined) {
    throw new ErrorWithStatusCode(500, 'ошибка сервера')
  }
  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorWithStatusCode(400, err.message));
      }
      if (err.path === '_id') {
        next(new ErrorWithStatusCode(404, 'Пользователь не найден'));
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ErrorWithStatusCode(409, 'Пользователь с таким email уже зарегистрирован'));
      }
      next(err);
    });
};

