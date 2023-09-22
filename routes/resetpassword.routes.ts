import express from 'express';
import {
  handleVerifyResetPasswordRequest,
  handleResetPasswordCreate,
  handleUpdateUserPassword,
} from '../controllers/resetpassword.controller';

const resetPasswordRouter = express.Router({ mergeParams: true });

resetPasswordRouter.put('/', handleResetPasswordCreate);
resetPasswordRouter.post('/verify', handleVerifyResetPasswordRequest);
resetPasswordRouter.post('/updatePassword', handleUpdateUserPassword);

export default resetPasswordRouter;
