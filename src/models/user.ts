import mongoose, { Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ErrorWithStatusCode } from '../middlewares/error-with-status-code';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

export interface IUserAPI extends Model<IUser> {
  findUserByCredentials(a: string, b: string): Promise<IUser>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v: string) {
        return /[-.\w]+@([\w-]+\.)+[\w-]+/i.test(v);
      },
      message: 'передан некорректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return (this as mongoose.Model<IUser>).findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new ErrorWithStatusCode(401, 'Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new ErrorWithStatusCode(401, 'Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

export const User = mongoose.model<IUser, IUserAPI>('user', userSchema);
