/**
 * Routes to handle the thread related operations.
 * a. Creation of a new thread.
 * b. Adding comments to an existing thread.
 * 
 * The above operations are possible only after the request is validated with a valid JWT.
 */

'use strict';

import express from 'express';
import { AccessModel, DiscussionModel } from '../models';
import { ResponseBody } from '../../lib';

const DiscussionRouter = new express.Router();
const { validateAccess } = AccessModel;

DiscussionRouter.post('/create-thread', validateAccess, createThread);
DiscussionRouter.post('/add-comment', validateAccess, addComment);
DiscussionRouter.post('/get-thread', validateAccess, getThread);

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

async function addComment(req, res) {
    const { body, locals } = req;
    try {
        const data = await DiscussionModel.addComment({...body, ...locals});
        res.status(data.statusCode).json(data);
    } catch (e) {
        const responseBody = new ResponseBody(500, e.toString());
        res.status(responseBody.statusCode).json(responseBody);
    }
}

async function getThread(req, res) {
    const { discussionId } = req.body;
    try {
        const data = await DiscussionModel.getThread(discussionId);
        res.status(data.statusCode).json(data);
    } catch (e) {
        const responseBody = new ResponseBody(500, e.toString());
        res.status(responseBody.statusCode).json(responseBody);
    }
}

export default DiscussionRouter;