const redis = require("redis")

exports.redisConnection = () => {
    const connection = redis.createClient({
        url: process.env.REDIS_URL
    }).on('error', err => console.log('Redis Client Error', err)).connect();
    return connection;
}