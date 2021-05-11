import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import { getUserInfo, updateUserInfo } from '../controllers/users';

const usersRouter = Router();

usersRouter.get('/me', getUserInfo);
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserInfo);

export { usersRouter };
