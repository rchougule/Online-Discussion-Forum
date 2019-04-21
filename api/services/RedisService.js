'use strict'

import bluebird from 'bluebird';
import redis from 'redis';

bluebird.promisifyAll(redis.RedisClient.prototype);

const RedisClient = redis.createClient();

RedisClient.on('ready', () => {
    console.log("[Info] Redis has Established the Connection and Started Serving.");
})

RedisClient.on('error', (err) => {
    console.log(`[Error] Redis has encountered an error : ${err.toString()}`);
})

export const Redis = {
    hset,
    hmset,
    hget,
    hgetAll
}

async function hset(key, field, value) {
    return RedisClient.hsetAsync(key, field, value)
}

async function hmset(key, obj) {
    return RedisClient.hmsetAsync(key, obj);
}

async function hget(key, field) {
    return RedisClient.hgetAsync(key, field)
}

async function hgetAll(key) {
    return RedisClient.hgetallAsync(key);
}