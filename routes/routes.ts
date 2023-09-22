import express from 'express';
import authRouter from './auth.routes';
import authenticateToken from '../middleware/auth.middleware';
import resetPasswordRouter from './resetpassword.routes';
import usersRouter from './users.routes';

const baseRouter = express.Router({ mergeParams: true });

baseRouter.use('/auth', authRouter);
baseRouter.use('/resetpassword', resetPasswordRouter);
baseRouter.use('/users', authenticateToken, usersRouter);

export default baseRouter;
