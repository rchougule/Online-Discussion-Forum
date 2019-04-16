'use strict'

import { ResponseBody } from '../../lib';

const routes = [
    { path: '/user', router: 'xyz router'}
];

routes.init = (app) => {
    // handle error routes or non-existent routes

    if(!app || !app.use) {
        console.error('[Error] Route Initialization Failed: app / app.use is undefined');
        return process.exit(1);
    }

    app.get('/health-check', (req, res, next) => {
        const responseBody = new ResponseBody(200, 'OK');
        response.status(responseBody.statusCode).json(responseBody);
    })
}

export default routes;