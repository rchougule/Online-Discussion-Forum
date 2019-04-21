/**
 * Operations to Handle the Thread related queries. i.e.
 * a. Thread Creation and Stats initialization
 * b. Commenting on a thread with stats updation.
 * 
 * Stats queries are speed up by using Redis Cache. Stats are updated in the persistent DB via Jobs, to take the load
 * off the main operation.
 */

'use strict'

import mongoose from 'mongoose';
import { ResponseBody } from '../../lib';
import { DiscussionSchema, ThreadStatsSchema } from '../schemas';
import { Redis } from '../services';

const Discussion = mongoose.model('Discussion', DiscussionSchema);
const ThreadStats = mongoose.model('ThreadStats', ThreadStatsSchema);
mongoose.set("useFindAndModify", false);

export const DiscussionModel = {
    createThread,
    addComment
}

async function createThread(attrs) {
    const discussionId = await _generateUniqueID();
    delete Object.assign(attrs, {createdBy: attrs.email, discussionId, bucketNo: 1, commentsCount: 0}).email;

    const discussionObject = new Discussion(attrs);
    const statsObject = new ThreadStats({discussionId});

    let data = await discussionObject.save();
    let statData = await statsObject.save();

    data = JSON.parse(JSON.stringify(data));
    delete data._id;
    delete data.bucketNo;
    delete data.commentsCount;
    delete data.createdAt;
    delete data.comments;

    const returnObj = new ResponseBody(201, 'Created', data);
    return returnObj;
}

async function addComment(attrs) {
    const { discussionId, comment, email } = attrs;

    let threadStats;
    try {
        threadStats = await Redis.hgetAll(`discussion:${discussionId}`);
        if(!threadStats) {
            threadStats = await ThreadStats.findOne({discussionId});
        }
    } catch (e) {
        console.error(`[Error] addComment Error : ${e.toString()}`);
    }

    let { currentBucket, totalComments } = threadStats;
    currentBucket = parseInt(currentBucket);
    totalComments = parseInt(totalComments);

    let conditions = {
        discussionId, 
        bucketNo: currentBucket
    };

    let update = {
        $inc: {
            commentsCount: 1
        },
        $push: {
            comments: {
                body: comment,
                date: Date.now(),
                commentedBy: email
            }
        }
    };

    let options = {
        upsert: true,
        new: true,
        fields: {
            commentsCount: 1
        }
    };
    
    const threadUpdate = await Discussion.findOneAndUpdate(conditions, update, options);

    const bucketInc = threadUpdate.commentsCount >= 10 ? 1 : 0;

    const threadStatsRedis = {
        totalComments: totalComments + 1,
        currentBucket: currentBucket + bucketInc
    }

    await Redis.hmset(`discussion:${discussionId}`, threadStatsRedis);

    const returnObj = new ResponseBody(201, 'Comment Added', threadUpdate);
    return returnObj;
}

async function _generateUniqueID() {
    let notFound = false, uniqueID;

    /**
     * loop to make sure that the generated ID is not assigned to any existing thread.
     */

    while(!notFound) {
        uniqueID = _getUniqueID(7)
        const doc = await Discussion.findOne({ discussionId: uniqueID});
        notFound = doc === null ? true : false;
    }

    return uniqueID;
}

function _getUniqueID(length) {
    // any unique ID generator can be used in place of the below logic, e.g. UUIDv4

    let all = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
    let uniqueId = '';

    for(let i = 0; i < length; i++) {
        uniqueId += all[Math.floor(Math.random()*(all.length - 1))];
    }

    return uniqueId;

}