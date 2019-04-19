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