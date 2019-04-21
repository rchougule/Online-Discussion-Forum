/**
 * BeeQueue Service to handle the updation of thread stats as independent jobs in queues
 */

'use strict'

import Queue from 'bee-queue';
import mongoose from 'mongoose';
import { ThreadStatsSchema } from '../schemas';

const ThreadStats = mongoose.model('ThreadStats', ThreadStatsSchema);
mongoose.set('useFindAndModify', false);

const discussionQueue = new Queue('discussionStats');

/**
 * Handler function to work on the jobs added in the queue
 */
discussionQueue.process(async (job) => {
    const { uniqueId, currentBucket, totalComments } = job.data;

    const threadStatsUpdate = await ThreadStats.findOneAndUpdate({
        discussionId:uniqueId
    }, {
        $set: {
            currentBucket,
            totalComments
        }
    }, {
        new: true, 
        fields: {
            _id: 0
        }
    })

    return job.data;
})

export const BeeQueue = {
    createJob
}

/**
 * Function to create jobs in BeeQueue
 * @param {*} queue refers to the job queue
 * @param {*} statData contains the data to be added in the job queue
 */
async function createJob(queue, statData) {
    const newJob = discussionQueue.createJob(statData)
    newJob.save()
    newJob.on('succeeded', (result) => {
        console.log(`[BeeQueue] Data Updated in DB for job ${newJob.id} : ${JSON.stringify(result)}`);
    })
}