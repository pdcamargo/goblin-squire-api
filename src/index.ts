require('dotenv').config();
import { io, server } from './app';
import socket from './socket';

import { logger } from './utils';

socket(io);

const PORT = process.env.PORT || 8181;

server.listen(PORT, () => {
  logger('⚡️ [server]', `Server is running at https://localhost:${PORT}`, {
    bg: 'bgCyan',
  });
});
