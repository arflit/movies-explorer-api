const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const ErrorWithStatusCode = require('../middlewares/error-with-status-code');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => User.findById(user._id))
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
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

module.exports.signOut = (req, res) => {
  res.clearCookie('jwt').send({ massege: 'cookie удалена!' });
};

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user)
    .orFail(new ErrorWithStatusCode(404, 'Пользователь не найден'))
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
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
