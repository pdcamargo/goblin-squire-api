import fs from 'fs';
import { v4 } from 'uuid';

import {
  CharacterSkill,
  DndDatabase,
  Character,
  CharacterSavingThrows,
  CharacterAbilityScore,
} from '../types/dnd';

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

export const getDatabase = () => {
  const obj: Record<string, any> = {};

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    const data = fs.readFileSync(`database/dnd/${key}.json`, 'utf8');
    obj[key] = JSON.parse(data);
  }

  return obj as DndDatabase;
};

export const database = getDatabase();

export const createDefaultCharacter = (): Character => {
  const skills = database.skills;
  const abilities = database['ability-scores'];

  const charSkills: CharacterSkill[] = [];
  const charSavingThrows: CharacterSavingThrows[] = [];
  const charAbilityScores: CharacterAbilityScore[] = [];

  for (let skill of skills) {
    charSkills.push({
      proficient: false,
      skill: skill.index,
      ability_score: null,
    });
  }

  for (let ability of abilities) {
    charSavingThrows.push({
      ability_score: ability.index,
      proficient: false,
    });

    charAbilityScores.push({
      ability_score: ability.index,
      value: 7 + charAbilityScores.length,
    });
  }

  return {
    id: v4(),
    userId: '',
    level: 1,
    bio: {
      age: null,
      name: 'Character ' + Math.random(),
    },
    classes: [],
    race: null,
    savingThrows: charSavingThrows,
    skills: charSkills,
    abilityScores: charAbilityScores,
  };
};
