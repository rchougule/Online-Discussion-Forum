'use strict'

import * as jwt from 'jsonwebtoken';
import { ResponseBody } from '../../lib';
import { JWT_CONFIG } from '../../config';

const { secret } = JWT_CONFIG;

export const AccessModel = {
    validateAccess
}

async function validateAccess(req, res, next) {
    const { headers } = req;
    const token = headers['x-access-token'];
    if(!token) {
        let responseBody = new ResponseBody(401, 'No Token Provided');
        res.status(responseBody.statusCode).json(responseBody);
    }
    try {
        const verification = jwt.verify(token, secret);
        req.locals = {email: verification.email};
        next();
    } catch (e) {
        let responseBody = new ResponseBody(500, 'Failed to Authenticate Token', e.toString());
        res.status(responseBody.statusCode).json(responseBody)
    }
}