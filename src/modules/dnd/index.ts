import { Module } from '../../types';
import { DndController } from './controller';

import createRouter from './router';
import { DndService } from './service';

const service = new DndService();
const controller = new DndController(service);
const router = createRouter(controller);

const mod: Module = {
  prefix: '/dnd',
  router,
};

export default mod;
