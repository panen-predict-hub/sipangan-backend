import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisConfig = process.env.REDIS_SOCKET_PATH
  ? { socket: { path: process.env.REDIS_SOCKET_PATH } }
  : { url: process.env.REDIS_URL || 'redis://localhost:6379' };

const redisClient = createClient(redisConfig);

redisClient.on('error', (err) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

// Connect to redis
(async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.error('Could not connect to Redis:', err);
  }
})();

export default redisClient;
