import { Server, Socket } from 'socket.io';

import { logger } from './utils';
import { database } from './services/dnd';
import { Character } from './types/dnd';

import tableService, { IUser, IGameTable } from './services/table';

type SetupProps = {
  tableId: string;
  userId: string;
};

type UpdateCharacterProps = {
  tableId: string;
  characterId: string;
  newValues: Partial<Character>;
};

type CreateCharacterProps = {
  tableId: string;
};

const CURRENT_CHARACTERS = 'currentCharacters';
const CURRENT_USERS = 'currentUsers';
const socket = (io: Server) => {
  io.on('connection', (socket) => {
    // logger('⚡️ [socket.io]', 'connection with id of ' + socket.id);

    socket.on('startTable', async ({ tableId, userId }: SetupProps) => {
      socket.join(`table:${tableId}`);
      socket.join(`user:${userId}`);
      (socket as any).tableId = tableId;
      (socket as any).userId = userId;

      const table = await tableService.connect(tableId, userId, socket.id);

      io.in(`table:${tableId}`).emit(CURRENT_USERS, table.users);

      socket.emit(`setupTable:${tableId}`, {
        ...table,
        database,
      });
    });

    socket.on(
      'updateCharacter',
      async ({ tableId, characterId, newValues }: UpdateCharacterProps) => {
        const table = await tableService.updateCharacter(
          tableId,
          characterId,
          newValues
        );

        socket
          .in(`table:${tableId}`)
          .emit(CURRENT_CHARACTERS, table.characters);
      }
    );

    socket.on('createCharacter', async ({ tableId }: CreateCharacterProps) => {
      const table = await tableService.createCharacter(tableId);

      io.in(`table:${tableId}`).emit(CURRENT_CHARACTERS, table.characters);
    });

    socket.on('disconnect', async () => {
      // logger('⚡️ [socket.io]', 'disconnection', { bg: 'bgMagenta' });
      const tableId = (socket as any).tableId;
      const userId = (socket as any).userId;

      if (tableId && userId) {
        const table = await tableService.disconnect(tableId, userId);

        io.in(`table:${tableId}`).emit(CURRENT_USERS, table.users);
      }
    });
  });
};

export default socket;
