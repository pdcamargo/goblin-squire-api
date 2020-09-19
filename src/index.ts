import { app, io, server } from './app';
import router from './router';
import socket from './socket';

import { logger } from './utils';

router(app);
socket(io);

import redis from 'redis';
const client = redis.createClient();

client.on('error', function (error) {
  console.error(error);
});

client.get('table', function (err, reply) {
  // reply is null when the key is missing
  if (reply) {
    console.log(JSON.parse(reply));
  }
});

const PORT = 3001;

server.listen(PORT, () => {
  logger('⚡️ [server]', `Server is running at https://localhost:${PORT}`, {
    bg: 'bgCyan',
  });
});
