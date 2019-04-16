'use strict'

import mongoose from 'mongoose';
import { SERVER_CONFIG, MONGO_CONFIG } from './config';
// connect to DB and then start server

const { PORT } = SERVER_CONFIG;

const startServer = async (app) => {
    const { DBNAME, CONNECTION_URI, OPTIONS } = MONGO_CONFIG;
    try {
        const connection = await mongoose.connect(CONNECTION_URI, { useNewUrlParser: true })
        console.log('[Info] Connected to MongoDB');

        const server = await app.listen(PORT);
        console.log(`[Info] Server Started Successfully. Listening on Port: ${PORT}`);
    } catch (error) {
        console.error(error);
        throw error
    }
}

export default startServer;