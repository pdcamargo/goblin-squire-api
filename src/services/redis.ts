import redis from 'redis';
import { logger } from '../utils';

const client = redis.createClient();
client.on('error', function (error) {
  logger('[redis]', error, { bg: 'bgBlue' });
});

export interface IRedisService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
}

class RedisService implements IRedisService {
  get<T>(key: string) {
    return new Promise<T | null>((resolve, reject) => {
      client.get(key, function (err, reply) {
        logger('[REDIS SERVICE]', `trying to GET key ${key}`, {
          bg: 'bgWhite',
          color: 'black',
        });

        if (err) {
          logger(
            '[REDIS SERVICE]',
            `error while getting key ${key}: ${err.message}`,
            {
              bg: 'bgYellow',
              color: 'black',
            }
          );

          return reject(err);
        }

        if (!reply) {
          logger('[REDIS SERVICE]', `did not found key ${key}`, {
            bg: 'bgYellow',
            color: 'black',
          });

          return resolve(null);
        }

        try {
          const data: T = JSON.parse(reply);

          logger('[REDIS SERVICE]', `found data for ${key}`, {
            bg: 'bgYellow',
            color: 'black',
          });

          return resolve(data);
        } catch (err) {
          return resolve((reply as unknown) as T);
        }
      });
    });
  }

  set<T>(key: string, value: T) {
    return new Promise<void>(async (resolve, reject) => {
      client.set(key, JSON.stringify(value), function (err) {
        logger('[REDIS SERVICE]', `trying to SET key ${key}`, {
          bg: 'bgBlack',
          color: 'white',
        });

        if (err) {
          logger(
            '[REDIS SERVICE]',
            `error while setting key ${key}: ${err.message}`,
            {
              bg: 'bgYellow',
              color: 'black',
            }
          );

          return reject(err);
        }

        logger('[REDIS SERVICE]', `Key ${key} settled`, {
          bg: 'bgCyan',
          color: 'black',
        });

        resolve();
      });
    });
  }
}

export default new RedisService();
