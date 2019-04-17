'use strict'

import mongoose from 'mongoose';
import { ResponseBody } from '../../lib';
import { UserSchema } from '../schemas';

const User = mongoose.model('User', UserSchema);

export const UserModel = {
    createUser,
    findUser
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

async function findUser(attrs) {
    const { email } = attrs;
    let user = await User.findOne({email}, 'password email updatedAt');
    if(!user) {
        throw new ResponseBody(401, 'No User Found');
    }
    let returnObject = new ResponseBody(200, 'OK', user);
    return returnObject
}