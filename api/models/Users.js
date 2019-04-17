'use strict'

import mongoose from 'mongoose';
import { ResponseBody } from '../../lib';
import { UserSchema } from '../schemas';

const User = mongoose.model('User', UserSchema);

export const UserModel = {
    createUser
}

async function createUser(attrs) {
    const newUserObj = new User(attrs);
    let data = await newUserObj.save();
    data = JSON.parse(JSON.stringify(data));
    delete data._id;
    delete data.password;
    delete data.createdAt;
    const returnObject = new ResponseBody(201, 'Created', data);
    return returnObject;
}