import { Server, Socket } from 'socket.io';

import { logger } from './utils';
import { database, createDefaultCharacter } from './services/dnd';
import { Character } from './types/dnd';

type SetupProps = {
  tableId: string;
  userId: string;
};

type User = {
  id: string;
  socket: string;
};

type Table = {
  id: string;
  users: User[];
  characters: Character[];
  database: typeof database;
};

const tables: Table[] = [];

const findTableIndex = (id: string) => tables.findIndex((t) => t.id === id);
const hasTable = (id: string) => findTableIndex(id) >= 0;
const getTable = (id: string) => tables.find((t) => t.id === id);
const emitCurrentUsers = (socket: Socket, tableId: string, users: User[]) => {
  socket.to(`table:${tableId}`).emit('currentUsers', users);
};
const emitCharacters = (
  socket: Socket,
  tableId: string,
  characters: Character[]
) => {
  socket.to(`table:${tableId}`).emit('characters', characters);
};
const addUserToTable = (id: string, userId: string, socket: Socket) => {
  if (hasTable(id)) {
    const tableIndex = findTableIndex(id);
    let table = tables[tableIndex];

    const hasCharacter =
      table.characters.find((c) => c.userId === userId) !== undefined;
    const newCharacter = createDefaultCharacter(userId);

    table = {
      ...table,
      users: [
        ...table.users.filter((u) => u.id !== userId),
        { id: userId, socket: socket.id },
      ],
    };

    if (!hasCharacter) {
      table.characters.push(newCharacter);
    }

    emitCurrentUsers(socket, table.id, table.users);
    emitCharacters(socket, table.id, table.characters);

    tables[tableIndex] = table;
  }
};

const removeSocketFromTable = (socket: Socket) => {
  const index = tables.findIndex((t) =>
    t.users.find((u) => u.socket === socket.id)
  );

  if (index >= 0) {
    let table = tables[index];
    const users = table.users.filter((u) => u.socket !== socket.id);
    table.users = users;

    tables[index] = table;

    emitCurrentUsers(socket, table.id, users);
  }
};

const socket = (io: Server) => {
  io.on('connection', (socket) => {
    logger('⚡️ [socket.io]', 'connection with id of ' + socket.id);

    socket.on('startTable', ({ tableId, userId }: SetupProps) => {
      logger(
        '⚡️ [socket.io]',
        `starting table of id ${tableId} and user of id ${userId}`
      );

      socket.join(`table:${tableId}`);
      socket.join(`user:${userId}`);

      if (!hasTable(tableId)) {
        tables.push({
          id: tableId,
          characters: [createDefaultCharacter(userId)],
          users: [
            {
              id: userId,
              socket: socket.id,
            },
          ],
          database,
        });
      } else {
        addUserToTable(tableId, userId, socket);
      }

      const table = getTable(tableId);
      logger(
        '⚡️ [socket.io]',
        `table settled with users ${table?.users.join(', ')}`,
        { bg: 'bgWhite' }
      );
      socket.emit(`setupTable:${tableId}`, table);
      console.log(table?.users);
    });

    socket.on('disconnect', () => {
      logger('⚡️ [socket.io]', 'disconnection', { bg: 'bgMagenta' });

      removeSocketFromTable(socket);
    });
  });
};

export default socket;
