import express from 'express';
import { DndController } from './controller';

const createRouter = (controller: DndController) => {
  const router = express.Router();

  router.get('/db', (req, res) => controller.getDatabase(req, res));

  return router;
};

export default createRouter;
