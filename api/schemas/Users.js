/**
 * Schema for the User Profile of the Online Discussion Forum
 */

'use strict'

import mongoose from 'mongoose';
import { isEmail } from 'validator';

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        index: true,
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
        validate: [ isEmail, 'Invalid Email Provided']
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export { UserSchema }