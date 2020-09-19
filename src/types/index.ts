import { Router, Request, Response, NextFunction } from 'express';

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type Module = {
  router: Router;
  prefix: string;
  middleware?: Middleware[];
  useAuth?: boolean;
};
