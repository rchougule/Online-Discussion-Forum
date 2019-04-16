'use strict'

import express from 'express';
import { ResponseBody } from '../../lib/ResponseBody';

const UserRouter = new express.Router();

UserRouter.get('/create-user', createUser);

function createUser(req, res) {
    res.status(200).send({test: "yes"})
}

export default UserRouter;