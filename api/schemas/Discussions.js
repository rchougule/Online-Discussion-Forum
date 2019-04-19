'use strict'

import mongoose from 'mongoose';

const { Schema }  = mongoose;

const DiscussionSchema = new Schema({
    discussionId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        required: true
    },
    bucketNo: {
        type: Number,
        index: true,
        required: true
    },
    commentsCount: {
        type: Number
    },
    comments: [{
        body: String,
        date: Date,
        commentedBy: String
    }]
})

DiscussionSchema.index({discussionId: 1, bucketNo: 1})
DiscussionSchema.set("autoIndex", false);

export { DiscussionSchema }