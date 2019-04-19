'use strict'

import mongoose from 'mongoose';
import { ResponseBody } from '../../lib';
import { DiscussionSchema, ThreadStatsSchema } from '../schemas';

const Discussion = mongoose.model('Discussion', DiscussionSchema);
const ThreadStats = mongoose.model('ThreadStats', ThreadStatsSchema);

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
    /**
     * fetch the current bucket comments count from threadsStat
     * Add the comment in the discussion thread of that bucket.
     * check the count of comments in that bucket, update the bucket count in the ThreadStats.
     * This will ensure that the next comment goes in a new bucket.
     */
    const { discussionId, comment } = attrs;
    const threadStats = await ThreadStats.findOne({discussionId}, "currentBucket");
    const { currentBucket } = threadStats;



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