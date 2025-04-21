import redisClient from "./redisClient.js";

const setCache = async (key, value, expiryInSeconds = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expiryInSeconds,
  });
};

export { setCache };
