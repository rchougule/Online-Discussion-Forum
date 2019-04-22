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


## TODO
1. Convert the job operation of updation of thread/discussion stats into a micro-service.
   1. This will reduce the load on the main process.
   2. This can be implemented using Pub-Sub Redis Mechanism.
