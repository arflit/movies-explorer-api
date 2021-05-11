import { Router } from 'express';
import { errors, celebrate, Joi } from 'celebrate';
import { usersRouter } from './users';
import { moviesRouter } from './movies';
import { createUser, login, signOut } from '../controllers/users';
import { auth } from '../middlewares/auth';
import { errorsHandler } from '../middlewares/errors-handler';
import { ErrorWithStatusCode } from '../middlewares/error-with-status-code';
import { requestLogger, errorLogger } from '../middlewares/logger';
const router = Router();

router.use(requestLogger);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);
router.post('/signout', auth, signOut);
router.use('/users', auth, usersRouter);
router.use('/movies', auth, moviesRouter);
router.use('*', (req, res, next) => {
  next(new ErrorWithStatusCode(404, 'Страница не найдена'));
});
router.use(errorLogger);
router.use(errors());
router.use(errorsHandler);

export { router };
