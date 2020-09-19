export type AbilityScore = {
  index: string;
  name: string;
  full_name: string;
  desc: string[];
  skills: Skill[];
  url: string;
};

export type DamageType = {
  index: string;
  name: string;
  desc: string[];
  url: string;
};

export type WeaponProperties = {
  index: string;
  name: string;
  desc: string[];
  url: string;
};

export type Skill = {
  index: string;
  name: string;
  desc: string[];
  ability_score: AbilityScore;
  url: string;
};

export type Equipment = {
  index: string;
  name: string;
  url: string;
};

export type Proficiency = {
  index: string;
  type: string;
  name: string;
  classes: Class[];
  races: Race[];
  url: string;
  references: Equipment[];
};

export type ProficiencyChoice = {
  choose: number;
  type: string;
  from: Proficiency[];
};

export type Subclass = {
  index: string;
  name: string;
  url: string;
};

export type SavingThrow = {
  index: string;
  name: string;
  url: string;
};

export type Class = {
  index: string;
  name: string;
  hit_die: number;
  proficiency_choices: ProficiencyChoice[];
  proficiencies: Proficiency[];
  saving_throws: SavingThrow[];
  starting_equipment: string;
  class_levels: string;
  subclasses: Subclass[];
  spells: string;
  url: string;
};

export type AbilityBonus = {
  index: string;
  name: string;
  bonus: number;
  url: string;
};

export type Language = {
  index: string;
  name: string;
  type: string;
  typical_speakers: string[];
  script: string;
  url: string;
};

export type Subrace = {
  index: string;
  name: string;
  race: Race;
  desc: string;
  ability_bonuses: AbilityBonus[];
  starting_proficiencies: Proficiency[];
  languages: Language[];
  racial_traits: Trait[];
  url: string;
};

export type StartingProficiencyOptions = {
  choose: number;
  type: string;
  from: Proficiency[];
};

export type Trait = {
  index: string;
  races: Race[];
  subraces: Subrace[];
  name: string;
  desc: string[];
  url: string;
};

export type Race = {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: AbilityBonus[];
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  starting_proficiencies: Proficiency[];
  starting_proficiency_options: StartingProficiencyOptions;
  languages: Language[];
  language_desc: string;
  traits: Trait[];
  subraces: Subrace[];
  url: string;
};

export type Senses = Record<string, string>;

export type Speed = {
  walk: string;
  swim: string;
};

export type Monster = {
  index: string;
  name: string;
  size: string;
  type: string;
  subtype: string;
  alignment: string;
  armor_class: number;
  hit_points: number;
  hit_dice: string;
  speed: Speed;
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
  proficiencies: Proficiency[];
  damage_vulnerabilities: any[];
  damage_resistances: any[];
  damage_immunities: any[];
  condition_immunities: any[];
  senses: Senses;
  languages: string;
  challenge_rating: number;
  special_abilities: any[];
  actions: any[];
  url: string;
};

export type Condition = {
  index: string;
  name: string;
  desc: string[];
  url: string;
};

export type EquipmentCategory = {
  index: string;
  name: string;
  equipment: Equipment[];
  url: string;
};

export type Feature = {
  index: string;
  class: Class;
  name: string;
  level: number;
  desc: string[];
  url: string;
};

export type MagicSchool = {
  index: string;
  name: string;
  desc: string;
  url: string;
};

export interface SpellcastingAbility {
  index: string;
  name: string;
  url: string;
}

export interface Info {
  name: string;
  desc: string[];
}

export type Spellcasting = {
  index: string;
  class: Class;
  level: number;
  spellcasting_ability: SpellcastingAbility;
  info: Info[];
  url: string;
};

export interface Dc {
  dc_type: AbilityScore;
  dc_success: string;
}

export interface Damage {
  damage_type: DamageType;
  damage_at_character_level: Record<string, string>;
}

export interface Spell {
  index: string;
  name: string;
  desc: string[];
  range: string;
  components: string[];
  ritual: boolean;
  duration: string;
  concentration: boolean;
  casting_time: string;
  level: number;
  damage: Damage;
  dc: Dc;
  school: MagicSchool;
  classes: Class[];
  subclasses: Subclass[];
  url: string;
}

export interface StartingEquipmentOption {
  choose: number;
  type: string;
  from: Equipment[];
}

export type StartingEquipment = {
  index: string;
  class: Class;
  starting_equipment: StartingEquipment[];
  starting_equipment_options: StartingEquipmentOption[];
  url: string;
};

export type DndDatabase = {
  'ability-scores': AbilityScore[];
  classes: Class[];
  conditions: Condition[];
  'damage-types': DamageType[];
  'equipment-categories': EquipmentCategory[];
  equipment: Equipment[];
  features: Feature[];
  languages: Language[];
  'magic-schools': MagicSchool[];
  monsters: Monster[];
  proficiencies: Proficiency[];
  races: Race[];
  skills: Skill[];
  spellcasting: Spellcasting[];
  spells: Spell[];
  'starting-equipment': StartingEquipment[];
  subclasses: Subclass[];
  subraces: Subrace[];
  traits: Trait[];
  'weapon-properties': WeaponProperties[];
};

export type CharacterClasses = {
  class: Class['index'];
  subclass: Subclass['index'] | null;
  level: number;
};

export type CharacterSkill = {
  skill: Skill['index'];
  proficient: boolean;
  ability_score: AbilityScore['index'] | null;
};

export type CharacterRace = {
  race: Race['index'];
  subrace: Subrace['index'] | null;
};

export type CharacterSavingThrows = {
  ability_score: AbilityScore['index'];
  proficient: boolean;
};

export type CharacterBio = {
  name: string;
  age: number | null;
};

export type CharacterAbilityScore = {
  ability_score: AbilityScore['index'];
  value: number;
};

export type Character = {
  userId: string;
  level: number;
  bio: CharacterBio;
  race: CharacterRace | null;
  classes: CharacterClasses[];
  skills: CharacterSkill[];
  savingThrows: CharacterSavingThrows[];
  abilityScores: CharacterAbilityScore[];
};
