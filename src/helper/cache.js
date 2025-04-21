import redisClient from "./redisClient.js";

const setCache = async (key, value, expiryInSeconds = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expiryInSeconds,
  });
};

const getCache = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};
export { setCache, getCache };
