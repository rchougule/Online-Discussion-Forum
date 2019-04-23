# Online-Discussion-Forum

A backend for Online Discussion Forum which replicates the flow of Thread Creation and handling the New Comments that come in.
This project focuses on how you can store and retrieve thread/dicussion related data along with efficient real time updation of the thread/discussion statistics with improved performance.

## Built Using
1. Express Web Framework for Node.js
2. JWT
3. MongoDB
4. Redis
5. BeeQueue

## Features
1. Overcomes the limitation of MongoDB's document size by following a hybrid strategy of organising the documents.
2. Neither all the comments are stored in a single document, nor they are stored as separate documents. The incoming comments are stored in buckets of size 'x' comments. This prevents a document from having a never ending array of comments and stores them in an efficient manner.
3. The above structure also helps in selective retrieval of comments related to a thread and doesn't require going through  the never ending array of comments.
4. Thread/Discussion stats are stored in Redis in-memory datastore for faster read/writes.
5. The thread/discussion stats are available in their most updated state in Redis in-memory datastore. This is replicated in the persistent DB (MongoDB) via the creation of jobs. These jobs are nothing but queues handling the updation of data into MongoDB in a separation operation/task.
6. Above operations are validated for a user after being authenticated via JWT.

## Configuration of Redis Server
**Memory Management**
1. Memory Policy set as **allkeys-lru**
   1. This will ensure that all the keys existing in the Redis in-memory datastore follow the LRU (Least Recently Used) strategy to get evicted from the memory. This is done to ensure that the keys which are used the least are removed from the datastore to make room for the new ones.
2. Samples to be considered for the above strategy **maxmemory samples**
   1. Lesser the number of samples considered, lesser the load on the CPU.
   2. Larger the number of samples considered, higher the load on the CPU.
   
```conf
# MAXMEMORY POLICY: how Redis will select what to remove when maxmemory
# is reached. You can select among five behaviors:
#
# volatile-lru -> Evict using approximated LRU among the keys with an expire set.
# allkeys-lru -> Evict any key using approximated LRU.
# volatile-lfu -> Evict using approximated LFU among the keys with an expire set.
# allkeys-lfu -> Evict any key using approximated LFU.
# volatile-random -> Remove a random key among the ones with an expire set.
# allkeys-random -> Remove a random key, any key.
# volatile-ttl -> Remove the key with the nearest expire time (minor TTL)
# noeviction -> Don't evict anything, just return an error on write operations.
#
# LRU means Least Recently Used
# LFU means Least Frequently Used
#
# Both LRU, LFU and volatile-ttl are implemented using approximated
# randomized algorithms.
#
# Note: with any of the above policies, Redis will return an error on write
#       operations, when there are no suitable keys for eviction.
#
#       At the date of writing these commands are: set setnx setex append
#       incr decr rpush lpush rpushx lpushx linsert lset rpoplpush sadd
#       sinter sinterstore sunion sunionstore sdiff sdiffstore zadd zincrby
#       zunionstore zinterstore hset hsetnx hmset hincrby incrby decrby
#       getset mset msetnx exec sort
#
# The default is:
#
maxmemory-policy allkeys-lru

# LRU, LFU and minimal TTL algorithms are not precise algorithms but approximated
# algorithms (in order to save memory), so you can tune it for speed or
# accuracy. For default Redis will check five keys and pick the one that was
# used less recently, you can change the sample size using the following
# configuration directive.
#
# The default of 5 produces good enough results. 10 Approximates very closely
# true LRU but costs more CPU. 3 is faster but not very accurate.
#
maxmemory-samples 9
```

**Daemonize the Redis-Server (Optional)**
1. This will run the Redis-Server as a background process as soon as it is started rather than being in the direct-control of the user.
```
################################# GENERAL #####################################

# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
daemonize yes
```
## How to Run
1. Install NPM packages ``` npm install ```
2. Start the Redis-Server with the provided **redis.conf** file or update the above mentioned configs in your existing .conf file. ``` redis-server /path/to/redisConfFile.conf ```
4. Start the MongoDB Server ``` mongod ```
3. Start the Node Server ``` node server.js ```

## APIs
1. Create User ***/user/create-user***

   **Request**
    ```
    var options: {
        method: string;
        url: string;
        headers: {
            'Cache-Control': string;
            'Content-Type': string;
        };
        body: {
            email: string;
            password: string;
        };
        json: boolean;
    }
    ```
    **Response**
    ```
    {
        "statusCode": 201,
        "message": "Created",
        "data": {
            "email": "chougule@gmail.com",
            "updatedAt": "2019-04-21T13:53:16.751Z",
            "__v": 0,
        }
    }
    ```

2. Authenticate User ***/user/authenticate***

    **Request** - Same as **Create User**
    **Response**
    ```
    {
        "statusCode": 200,
        "message": "OK",
        "data": {
            "email": "chougule@gmail.com",
            "updatedAt": "2019-04-17T19:42:45.139Z",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNob3VndWxlQGdtYWlsLmNvbSIsInVwZGF0ZWRBdCI6IjIwMTktMDQtMTdUMTk6NDI6NDUuMTM5WiIsImlhdCI6MTU1NTY1OTc2NywiZXhwIjoxNTU1Njk1NzY3fQ.n_J_qh3G8AtMMsYoY4JNREtotvkhJXY1OHvwZnyb-7c"
        }
    }
    ```

3. Create Discussion Thread ***/thread/create-thread***

    **Request**
    ```
    var options: {
        method: string;
        url: string;
        headers: {
            'Cache-Control': string;
            'x-access-token': string;
            'Content-Type': string;
        };
        body: {
            title: string;
            content: string;
        };
        json: boolean;
    }
    ```
    **Response**
    ```
    {
        "statusCode": 201,
        "message": "Created",
        "data": {
            "title": String,
            "content": String,
            "createdBy": "xyz@gmail.com",
            "discussionId": "QLWTE4G",
            "__v": 0
        }
    }
    ```

4. Add Comment to a Thread ***/thread/add-comment***

   **Request**
   ```
    var options: {
        method: string;
        url: string;
        headers: {
            'Cache-Control': string;
            'x-access-token': string;
            'Content-Type': string;
        };
        body: {
            discussionId: string;
            comment: string;
        };
        json: boolean;
    }
   ```
   **Response**
   ```
   {
        "statusCode": 201,
        "message": "Comment Added"
    }
   ```
  

## TODO
1. Convert the job operation of updation of thread/discussion stats into a separate micro-service.
   1. This will reduce the load on the main process.
   2. This can be implemented using Pub-Sub Redis Mechanism.
2. API to fetch the thread/discussion related data
