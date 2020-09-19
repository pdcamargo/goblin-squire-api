import { DndDatabase } from '../../types/dnd';

export interface IDndService {
  getDatabase: () => DndDatabase;
}
