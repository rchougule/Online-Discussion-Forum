/**
 * Schema of a Discussion Thead
 * Each thread is divided in buckets of comments. I.e. As soon as comments reach a specific count in that bucket (document),
 * the further comments are pushed into a new bucket, i.e. a new document of the same thread. This will prevent the 
 * document from exceeding it's size limit.
 */

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