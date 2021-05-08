const jwt = require('jsonwebtoken');
const ErrorWithStatusCode = require('./error-with-status-code');

const { NODE_ENV, JWT_SECRET } = process.env;

function auth(req, res, next) {
  if (!(req.cookies.jwt)) {
    next(new ErrorWithStatusCode(401, 'Необходима авторизация'));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new ErrorWithStatusCode(401, 'Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
}

module.exports = auth;
