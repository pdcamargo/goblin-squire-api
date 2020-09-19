import { Module } from '../../types';

import router from './router';

const mod: Module = {
  prefix: '/auth',
  router,
};

export default mod;
