'use strict'

import express from 'express';
import * as jwt from 'jsonwebtoken';
import { ResponseBody } from '../../lib';
import { JWT_CONFIG } from '../../config';
import { UserModel } from '../models';

const { secret } = JWT_CONFIG; 

const UserRouter = new express.Router();

UserRouter.post('/create-user', createUser);

async function createUser(req, res) {
    const { body } = req;
    try {
        const data = await UserModel.createUser(body);
        const payload = {
            email: data.data.email,
            updatedAt: data.data.updatedAt
        }
        const token = jwt.sign(payload, secret, { expiresIn: '10h'});
        data.data.token = token;
        res.status(data.statusCode).json(data);
    } catch (e) {
        const errorObj = new ResponseBody(500, e.toString());
        res.status(errorObj.statusCode).json(errorObj);
    }
}

export default UserRouter;