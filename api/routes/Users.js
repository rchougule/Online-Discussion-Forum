/**
 * Routes for the user related operations, i.e.
 * a. New User Creation
 * b. Authentication
 */

'use strict'

import express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { ResponseBody } from '../../lib';
import { JWT_CONFIG } from '../../config';
import { UserModel } from '../models';

const { secret } = JWT_CONFIG; 

const UserRouter = new express.Router();

UserRouter.post('/create-user', createUser);
UserRouter.post('/authenticate', authenticateUser);

async function createUser(req, res) {
    const { body } = req;
    try {
        body.password = await bcrypt.hash(body.password, 8);
        const data = await UserModel.createUser(body);
        res.status(data.statusCode).json(data);
    } catch (e) {
        const errorObj = new ResponseBody(500, e.toString());
        res.status(errorObj.statusCode).json(errorObj);
    }
}

async function authenticateUser(req, res) {
    const { body } = req;
    try {
        const data = await UserModel.findUser(body);
        const match = await bcrypt.compare(body.password, data.data.password);
        if(match) {
            const payload = {
                email: data.data.email,
                updatedAt: data.data.updatedAt
            }
            const token = jwt.sign(payload, secret, { expiresIn: '10h'});
            let responseBody = new ResponseBody(200, 'OK', {...payload, token});
            res.status(responseBody.statusCode).json(responseBody);
        } else {
            let responseBody = new ResponseBody(401, 'Invalid Credentials');
            throw responseBody;
        }
    } catch (e) {
        res.status(e.statusCode).json(e);
    }
}

export default UserRouter;