'use strict'

const MONGO_CONFIG = {
    DBNAME: 'ODF',
    HOST: '127.0.0.1',
    PORT: '27017',
    OPTIONS: {
        db: { native_parser: true},
        server: { poolSize: 5}
    }
}

MONGO_CONFIG.CONNECTION_URI = `mongodb://${MONGO_CONFIG.HOST}:${MONGO_CONFIG.PORT}/${MONGO_CONFIG.DBNAME}`;

export { MONGO_CONFIG }