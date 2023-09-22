import { NextFunction, Response } from 'express';
import {
  getUserById,
  GetUserByIdRequest,
  patchUser, patchUserPassword, PatchUsersPasswordRequest, PatchUsersRequest,
} from '../services/user.service';

export const handlePatchUsers = async (
  req: PatchUsersRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = res.locals.user?.id;
  const { user } = req.body;

  await patchUser({ ...user, id: userId });
  return res.status(200).send({ user });
};

export const handleUpdateUserPassword = async (
  req: PatchUsersPasswordRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = res.locals.user?.id;
  const { password, newPassword } = req.body;
  const result = await patchUserPassword(userId, password, newPassword);
  return result
    ? res.status(201).send()
    : res.status(403).send();
};

export const handleGetUserById = async (
  req: GetUserByIdRequest,
  res: Response,
  next: NextFunction,
) => {
  const id = res.locals.user?.id;
  const user = await getUserById(id);
  return user
    ? res.status(200).send({ user })
    : res.status(404).send();
};
