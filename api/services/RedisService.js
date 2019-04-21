/**
 * Redis Service to improve the performance of read/write of thread stats by caching in in-memory datastore.
 * Thread stats are required to maintain the current bucket the comments are being inserted into.
 * Thus, quick reads of real time data is required to get the latest bucket and comments count.
 */

'use strict'

import bluebird from 'bluebird';
import redis from 'redis';
import { BeeQueue } from './BeeQueueService';

bluebird.promisifyAll(redis.RedisClient.prototype);

const RedisClient = redis.createClient();

RedisClient.on('ready', () => {
    console.log("[Info] Redis has Established the Connection and Started Serving.");
})

RedisClient.on('error', (err) => {
    console.log(`[Error] Redis has encountered an error : ${err.toString()}`);
})

export const Redis = {
    hmset,
    hgetAll
}

async function hmset(key, obj) {
    const [queue, uniqueId] = key.split(":");
    BeeQueue.createJob(`${queue}Queue`, {...obj, uniqueId})
    return RedisClient.hmsetAsync(key, obj);
}

async function hgetAll(key) {
    return RedisClient.hgetallAsync(key);
}