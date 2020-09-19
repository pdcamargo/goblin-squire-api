import { Application } from 'express';
import { authMiddleware } from './middlewares';

import modules from './modules';

const router = (app: Application) => {
  for (let module of modules) {
    const { prefix, router, middleware = [], useAuth = false } = module;

    if (useAuth) {
      middleware.push(authMiddleware);
    }

    app.use(prefix, middleware, router);
  }
};

export default router;
