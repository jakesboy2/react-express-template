import bcrypt from 'bcrypt';
import { database } from '../database';
import { TypedRequest } from '../shared/types';

export interface User {
  id: number;
  email: string;
  displayName: string;
  password: string;
}
export interface ICreateUser {
  email: string;
  password: string;
}

export interface IVerifyUser {
  email: string;
  password: string;
}

export type PatchUsersRequest = TypedRequest<{}, {}, { user: Omit<User, 'id'> }>;
export type PatchUsersPasswordRequest = TypedRequest<
  {}, {}, { password: string, newPassword: string }
>;
export type GetUserByIdRequest = TypedRequest<{}, {}, {}>;

export const createUser = async (user: ICreateUser): Promise<boolean> => {
  const { email, password } = user;
  const existingUser = await database('users')
    .select()
    .where({ email }) as User[];

  if (existingUser.length) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await database('users').insert({ email, password: hashedPassword }, ['id']);
    return true;
  } catch (err) {
    console.error(err);
  }

  return false;
};

export const getUserForLogin = async (user: IVerifyUser): Promise<User | null> => {
  const { email, password } = user;
  const foundUsers = await database('users')
    .select()
    .where({ email }) as User[];

  if (!foundUsers[0]) {
    return null;
  }

  const foundUser = foundUsers[0];
  const result = await bcrypt.compare(password, foundUser.password);
  return result ? foundUser : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const foundUser = await database('users')
    .select()
    .where({ email }) as User[];

  if (!foundUser[0]) {
    return null;
  }

  return foundUser[0];
};

export const patchUser = async (user: User): Promise<number> => database('users')
  .select()
  .where({ id: user.id })
  .update(user);

export const patchUserPassword = async (
  userId: number,
  password: string,
  newPassword: string,
): Promise<boolean> => {
  const foundUser = await database('users')
    .select()
    .where({ id: userId })
    .first() as User;
  if (!foundUser) {
    return false;
  }

  const passwordCheckResult = await bcrypt.compare(password, foundUser.password);
  if (!passwordCheckResult) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await database('users')
    .select()
    .where({ id: userId })
    .update({ password: hashedPassword });
  return result > 0;
};

export const getUserById = async (
  id: number,
): Promise<User | null> => {
  const foundUser = await database('users')
    .select()
    .where({ id })
    .first() as User | null;

  return foundUser;
};
