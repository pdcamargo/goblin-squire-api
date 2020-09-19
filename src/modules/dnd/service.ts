import fs from 'fs';

import { DndDatabase } from '../../types/dnd';

import { IDndService } from './types';

let cache: DndDatabase;

const keys = [
  'ability-scores',
  'classes',
  'conditions',
  'damage-types',
  'equipment-categories',
  'equipment',
  'features',
  'languages',
  'magic-schools',
  'monsters',
  'proficiencies',
  'races',
  'skills',
  'spellcasting',
  'spells',
  'starting-equipment',
  'subclasses',
  'subraces',
  'traits',
  'weapon-properties',
];

export class DndService implements IDndService {
  getDatabase() {
    const obj: Record<string, any> = {};

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const data = fs.readFileSync(`database/dnd/${key}.json`, 'utf8');
      obj[key] = JSON.parse(data);
    }

    cache = obj as DndDatabase;

    return cache;
  }
}
