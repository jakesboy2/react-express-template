import bcrypt from 'bcrypt';
import { TypedRequest } from '../shared/types';
import { database } from '../database';
import { getUserByEmail } from './user.service';

export interface ResetPassword{
  id: number;
  userId: number;
  accessCode: string;
  createdAt: number;
}

export type CreateResetPasswordRequest = TypedRequest<{}, {}, { email: string }>;
export type VerifyResetPasswordRequest = TypedRequest<
  {}, {}, { email: string, accessCode: string }
>;
export type UpdateUserPasswordRequest = TypedRequest<
  {}, {}, { email: string, accessCode: string, password: string }
>;

export const createResetPasswordRequest = async (userId: number): Promise<string> => {
  // Generates 6 digit number
  const accessCode = Math.floor(Math.random() * 899999 + 100000).toString();
  const hashedAccessCode = await bcrypt.hash(accessCode, 10);

  const requestData: Omit<ResetPassword, 'id'> = {
    userId,
    accessCode: hashedAccessCode,
    createdAt: Date.now(),
  };
  await database('reset_password_requests').insert(requestData, ['id']);

  return accessCode;
};

export const verifyResetPasswordRequest = async (
  request: { email: string, accessCode: string },
): Promise<boolean> => {
  const { email, accessCode } = request;
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }
  const resetPasswordRequest = await database('reset_password_requests')
    .select()
    .where({ userId: user.id })
    .orderBy('createdAt', 'desc')
    .first() as ResetPassword;

  if (!resetPasswordRequest) {
    return false;
  }

  // expire in 1 hr
  const offset = 60 * 60 * 1000;
  if (resetPasswordRequest.createdAt + offset < Date.now()) {
    return false;
  }

  return bcrypt.compare(accessCode, resetPasswordRequest.accessCode);
};

export const deleteResetPasswordRequest = async (userId: number): Promise<boolean> => {
  const result = await database
    .select()
    .from('reset_password_requests')
    .where({ userId })
    .delete();
  return result > 0;
};

export const updateUserPassword = async (
  request: { userId: number, password: string},
): Promise<number> => {
  const { userId, password } = request;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await database('users')
    .where({ id: userId })
    .update({ password: hashedPassword }, 'id');
  return result.length;
};
