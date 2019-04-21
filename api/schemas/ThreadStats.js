/**
 * Schema to maintain the Thread Statistics, i.e. Real time state of a specific discussion thread, which contains:-
 * a. The bucket in which the incoming comment would be added.
 * b. Total Comments Count.
 * The above data is updated by the jobs being handled by the BeeQueue
 */

'use strict'

import mongoose from 'mongoose';

const { Schema } = mongoose;

const ThreadStatsSchema = new Schema({
    discussionId: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    currentBucket: {
        type: Number,
        default: 1
    },
    totalComments: {
        type: Number,
        default: 0       
    }
})

export { ThreadStatsSchema }