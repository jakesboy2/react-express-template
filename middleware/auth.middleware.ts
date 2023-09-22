import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const accessKey = process.env.JWT_TOKEN;

  const accessToken = req.headers['authorization']?.split(' ')[1];

  if (!accessKey) {
    return res.status(500).send('Secret key(s) not found');
  }

  try {
    if (!accessToken) {
      throw Error('Missing access token');
    }
    const payload = jwt.verify(accessToken, accessKey) as any;
    res.locals.user = { id: payload.id, email: payload.email };
  } catch (err) {
    return res.status(401).send('Access Denied');
  }

  next();
};

export default authenticateToken;
