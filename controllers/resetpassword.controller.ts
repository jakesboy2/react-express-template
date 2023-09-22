import { NextFunction, Response } from 'express';
import {
  getUserByEmail,
} from '../services/user.service';
import {
  createResetPasswordRequest,
  CreateResetPasswordRequest,
  deleteResetPasswordRequest,
  updateUserPassword,
  UpdateUserPasswordRequest,
  verifyResetPasswordRequest,
  VerifyResetPasswordRequest,
} from '../services/resetpassword.service';
import { FROM_EMAIL, sendMail } from '../services/mailer.service';

export const handleResetPasswordCreate = async (
  req: CreateResetPasswordRequest,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    // Don't indicate the emai's lack of existance
    return res.status(200).send();
  }

  const accessCode = await createResetPasswordRequest(user.id);
  await sendMail({
    to: email,
    from: FROM_EMAIL,
    subject: 'Plando Reset Password Access Code',
    text: `
      You recently requested to reset your Plando password. Please enter the following access code to continue:
      Access Code: ${accessCode}
    `,
  });

  return res.status(200).send();
};

export const handleVerifyResetPasswordRequest = async (
  req: VerifyResetPasswordRequest,
  res: Response,
) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).send();
  }

  const result = await verifyResetPasswordRequest(req.body);
  return result
    ? res.status(200).send()
    : res.status(401).send();
};

export const handleUpdateUserPassword = async (
  req: UpdateUserPasswordRequest,
  res: Response,
) => {
  const { email, accessCode, password } = req.body;
  const result = await verifyResetPasswordRequest({ email, accessCode });
  if (!result) {
    return res.status(401).send();
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return res.status(401).send();
  }

  const passwordUpdateResult = await updateUserPassword({ userId: user.id, password });
  await deleteResetPasswordRequest(user?.id);

  return res.status(200).send({ passwordUpdateResult });
};
