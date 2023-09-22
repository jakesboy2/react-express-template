import express from 'express';
import {
  handleGetUserById,
  handlePatchUsers, handleUpdateUserPassword,
} from '../controllers/users.controller';

const usersRouter = express.Router({ mergeParams: true });

usersRouter.patch('/', handlePatchUsers);
usersRouter.patch('/password', handleUpdateUserPassword);
usersRouter.get('/', handleGetUserById);

export default usersRouter;
