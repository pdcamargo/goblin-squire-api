import { HttpStatusCode } from '../enums';
import { Middleware } from '../types';

export const authMiddleware: Middleware = (req, res, next) => {
  const {
    headers: { authorization },
  } = req;

  if (!authorization) {
    res.status(HttpStatusCode.UNAUTHORIZED).send({
      ok: false,
    });

    return;
  }

  next();
};
