'use strict';

import express from 'express';
import { AccessModel, DiscussionModel } from '../models';
import { ResponseBody } from '../../lib';

const DiscussionRouter = new express.Router();
const { validateAccess } = AccessModel;

DiscussionRouter.post('/create-thread', validateAccess, createThread);

async function createThread(req, res) {
    const { body, locals } = req;
    const attrs = {
        ...body,
        ...locals
    }
    try {
        const data = await DiscussionModel.createThread(attrs);
        res.status(data.statusCode).json(data);
    } catch (e) {
        const responseBody = new ResponseBody(500, e.toString());
        res.status(responseBody.statusCode).json(responseBody);
    }
}

export default DiscussionRouter;