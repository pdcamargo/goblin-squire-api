import { Socket } from 'socket.io';

import { IRedisService } from '../redis';
import { createDefaultCharacter, database } from '../dnd';

import { Character } from '../../types/dnd';
import { logger } from '../../utils';

export interface ITable {
  getTable(tableId: string): Promise<IGameTable>;
  connect: (
    tableId: string,
    userId: string,
    socketId: string
  ) => Promise<IGameTable>;
  disconnect(tableId: string, userId: string): Promise<IGameTable>;
  createCharacter: (tableId: string, userId: string) => Promise<IGameTable>;
  updateCharacter: (
    tableId: string,
    characterId: string,
    newValues: Partial<Character>
  ) => Promise<IGameTable>;
  deleteCharacter(tableId: string, characterId: string): Promise<IGameTable>;
}

export type IUser = {
  id: string;
  name: string;
  socketId: string;
};

export type IGameTable = {
  id: string;
  gm: string;
  characters: Character[];
  users: IUser[];
};

const validTableId = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

const createDefaultTable = (
  tableId: string,
  userId: string,
  socketId: string
): IGameTable => ({
  id: tableId,
  gm: userId,
  characters: [],
  users: [
    {
      id: userId,
      name: userId,
      socketId,
    },
  ],
});

export class Table implements ITable {
  constructor(public redis: IRedisService) {}

  async getTable(tableId: string) {
    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (!table) {
      return Promise.reject('Table not found');
    }

    return table;
  }

  async connect(tableId: string, userId: string, socketId: string) {
    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (table) {
      logger('[TABLE SERVICE]', `table found with id ${tableId}`, {
        bg: 'bgRed',
        color: 'black',
      });

      const userIndex = table.users.findIndex((u) => u.id === userId);

      if (userIndex >= 0) {
        const user = table.users[userIndex];
        if (user.socketId !== socketId) {
          table.users[userIndex].socketId = socketId;
        }
      } else {
        table.users.push({
          id: userId,
          name: userId,
          socketId,
        });
      }

      await this.redis.set(`table:${tableId}`, table);

      logger(
        '[TABLE SERVICE]',
        `user ${userId} connected in table ${tableId} with ${table.users.length} users online`,
        {
          bg: 'bgRed',
          color: 'black',
        }
      );

      return table;
    }

    const defaultTable = createDefaultTable(tableId, userId, socketId);
    await this.redis.set(`table:${tableId}`, defaultTable);

    logger(
      '[TABLE SERVICE]',
      `table id ${tableId} was not found on database, a new table has been created`,
      {
        bg: 'bgRed',
        color: 'black',
      }
    );

    return defaultTable;
  }

  async disconnect(tableId: string, userId: string) {
    logger(
      '[TABLE SERVICE]',
      `trying to disconnect user ${userId} in table ${tableId}`,
      {
        bg: 'bgRed',
        color: 'black',
      }
    );

    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (!table) {
      logger('[TABLE SERVICE]', `table with id ${tableId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('Table not found');
    }

    const userIndex = table.users.findIndex((c) => c.id === userId);

    if (userIndex === -1) {
      logger('[TABLE SERVICE]', `user with id ${userId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('User not found');
    }

    table.users = table.users.filter((c) => c.id !== userId);

    await this.redis.set(`table:${tableId}`, table);

    logger('[TABLE SERVICE]', `user with id ${userId} disconnected`, {
      bg: 'bgRed',
      color: 'black',
    });

    return table;
  }

  async createCharacter(tableId: string) {
    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (!table) {
      logger('[TABLE SERVICE]', `table with id ${tableId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('Table not found');
    }

    const character = createDefaultCharacter();
    table.characters.push(character);

    await this.redis.set(`table:${tableId}`, table);

    return table;
  }

  async updateCharacter(
    tableId: string,
    characterId: string,
    newValues: Partial<Character>
  ) {
    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (!table) {
      logger('[TABLE SERVICE]', `table with id ${tableId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('Table not found');
    }

    const characterIndex = table.characters.findIndex(
      (c) => c.id === characterId
    );

    if (characterIndex === -1) {
      logger('[TABLE SERVICE]', `character id ${characterId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('Character not found');
    }

    const character = { ...table.characters[characterIndex], ...newValues };

    table.characters[characterIndex] = character;

    await this.redis.set(`table:${tableId}`, table);

    logger('[TABLE SERVICE]', `character id ${characterId} updated`, {
      bg: 'bgRed',
      color: 'black',
    });

    return table;
  }

  async deleteCharacter(tableId: string, characterId: string) {
    const table = await this.redis.get<IGameTable>(`table:${tableId}`);

    if (!table) {
      logger('[TABLE SERVICE]', `table with id ${tableId} not found`, {
        bg: 'bgRed',
        color: 'black',
      });

      return Promise.reject('Table not found');
    }

    const characterIndex = table.characters.findIndex(
      (c) => c.id === characterId
    );

    if (characterIndex === -1) {
      return Promise.reject('Character not found');
    }

    table.characters = table.characters.filter((c) => c.id !== characterId);

    await this.redis.set(`table:${tableId}`, table);

    logger('[TABLE SERVICE]', `character id ${characterId} deleted`, {
      bg: 'bgRed',
      color: 'black',
    });

    return table;
  }
}
