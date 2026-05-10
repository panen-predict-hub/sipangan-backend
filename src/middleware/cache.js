import redisClient from '../config/redis.js';

/**
 * Middleware to cache responses in Redis
 * @param {number} duration - Cache duration in seconds
 * @param {boolean} userSpecific - Whether the cache should be unique per user
 */
const cacheMiddleware = (duration = 3600, userSpecific = false) => {
  return async (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    let key = `cache:${req.originalUrl || req.url}`;
    
    // If userSpecific is true and user is authenticated, append user id to key
    if (userSpecific && req.user && req.user.id) {
      key = `cache:${req.user.id}:${req.originalUrl || req.url}`;
    }

    try {
      const cachedResponse = await redisClient.get(key);

      if (cachedResponse) {
        console.log(`Cache hit for ${key}`);
        return res.status(200).json(JSON.parse(cachedResponse));
      }

      console.log(`Cache miss for ${key}`);

      // Store the original send method
      const originalSend = res.json;

      // Override res.json to cache the response
      res.json = (body) => {
        // Check if the status code is successful before caching
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redisClient.setEx(key, duration, JSON.stringify(body))
            .catch(err => console.error('Redis Cache Set Error:', err));
        }
        
        return originalSend.call(res, body);
      };

      next();
    } catch (error) {
      console.error('Redis Cache Middleware Error:', error);
      next();
    }
  };
};

/**
 * Utility to clear cache by pattern
 * @param {string} pattern - Pattern to match keys (e.g., 'cache:/api/commodities*')
 */
export const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Cleared cache for pattern: ${pattern}`);
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

export default cacheMiddleware;
