'use strict'

import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import startServer from './startServer';

const app = Express();

// Middleware Initialization
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb', parameterLimit: 50000}));

//Routes Initialization

// Start the Server
startServer(app);
