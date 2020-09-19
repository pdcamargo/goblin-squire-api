import { app, io, server } from './app';
import router from './router';
import socket from './socket';

import { logger } from './utils';

router(app);
socket(io);

const PORT = 3001;

server.listen(PORT, () => {
  logger('⚡️ [server]', `Server is running at https://localhost:${PORT}`, {
    bg: 'bgCyan',
  });
});
