import { Module } from '../types';

import authModule from './auth';
import dndModule from './dnd';

const modules: Module[] = [authModule, dndModule];

export default modules;
