import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as EmailValidator from 'email-validator';
import {
  createUser, getUserByEmail, getUserForLogin, ICreateUser, IVerifyUser,
} from '../services/user.service';

const accessTokenExpiration = '15m';
const refreshTokenExpiration = '1d';

export const handleLogin = async (
  req: Request<{}, {}, IVerifyUser>,
  res: Response,
  next: NextFunction,
) => {
  const accessKey = process.env.JWT_TOKEN;
  const refreshKey = process.env.JWT_REFRESH_TOKEN;
  if (!accessKey || !refreshKey) {
    return res.status(500).send('Secret key(s) not found');
  }

  const { email, password } = req.body;
  const user = await getUserForLogin({ email, password });
  if (!user) {
    return res.status(401).send('Invalid email and password');
  }

  const userToSend = { id: user.id, email: user.email, displayName: user.displayName };
  const accessToken = jwt.sign(userToSend, accessKey, { expiresIn: accessTokenExpiration });
  const refreshToken = jwt.sign(userToSend, refreshKey, { expiresIn: refreshTokenExpiration });
  return res.status(200).send({ user: userToSend, accessToken, refreshToken });
};

const validateUserSignup = async (userInfo: ICreateUser) => {
  const validEmail = EmailValidator.validate(userInfo.email);
  if (!validEmail) {
    return false;
  }

  const existingUser = await getUserByEmail(userInfo.email);
  if (existingUser) {
    return false;
  }

  // password requirement validation would go here
  return true;
};

export const handleSignup = async (
  req: Request<{}, {}, ICreateUser>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  const validUser = await validateUserSignup({ email, password });

  if (!validUser) {
    return res.status(400).send('Invalid information');
  }

  const isSuccess = await createUser({ email, password });
  return isSuccess
    ? res.status(200).send('Successfully created user')
    : res.status(400).send('Failed to create user');
};

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const accessKey = process.env.JWT_TOKEN;
  const refreshKey = process.env.JWT_REFRESH_TOKEN;
  if (!accessKey || !refreshKey) {
    return res.status(500).send('Secret key(s) not found');
  }

  const receivedRefreshToken = req.headers.authorization?.split(' ')[1];
  let payload: any = {};
  try {
    if (!receivedRefreshToken) {
      throw Error('Missing refresh token');
    }
    payload = jwt.verify(receivedRefreshToken, refreshKey);
  } catch (err) {
    return res.status(401).send('Could not refresh access token');
  }

  const userToSend = {
    id: payload.id,
    email: payload.email,
  };

  const accessToken = jwt.sign(userToSend, accessKey, { expiresIn: accessTokenExpiration });
  const refreshToken = jwt.sign(userToSend, refreshKey, { expiresIn: refreshTokenExpiration });
  return res.status(200).send({ accessToken, refreshToken });
};

export const handleVerify = async (req: Request, res: Response, next: NextFunction) => {
  const accessKey = process.env.JWT_TOKEN;

  if (!accessKey) {
    return res.status(500).send('Secret key(s) not found');
  }

  const receivedRefreshToken = req.headers.authorization?.split(' ')[1];

  try {
    if (!receivedRefreshToken) {
      throw Error('Missing refresh token');
    }
    jwt.verify(receivedRefreshToken, accessKey);
  } catch (err) {
    return res.status(401).send('Could not verify token');
  }

  return res.status(200).send();
};
