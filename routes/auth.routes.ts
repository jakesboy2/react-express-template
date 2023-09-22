import express from 'express';
import {
  handleLogin, handleRefreshToken, handleSignup, handleVerify,
} from '../controllers/auth.controller';

const authRouter = express.Router({ mergeParams: true });

authRouter.post('/login', handleLogin);
authRouter.post('/signup', handleSignup);
authRouter.post('/refresh', handleRefreshToken);
authRouter.get('/verify', handleVerify);

export default authRouter;
