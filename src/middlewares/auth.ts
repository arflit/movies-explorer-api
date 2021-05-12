import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ErrorWithStatusCode } from './error-with-status-code';

const { JWT_SECRET = 'dev-secret' } = process.env;

declare global {
  namespace Express {
    interface Request {
      user: { _id: string } | undefined;
    }
  }
}

const auth: RequestHandler = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new ErrorWithStatusCode(401, 'Необходима авторизация'));
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET) as { _id: string };
  } catch (err) {
    return next(new ErrorWithStatusCode(401, 'Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};

export { auth };
