'use strict'

import { ResponseBody } from '../../lib';
import UserRouter from './Users';


const routes = [
    { path: '/user', router: UserRouter}
];

routes.init = app => {
    if(!app || !app.use) {
        console.error('[Error] Route Initialization Failed: app / app.use is undefined');
        return process.exit(1);
    }

    routes.forEach((route) => {
        app.use(route.path, route.router)
    })

    app.get('/health-check', (req, res, next) => {
        const responseBody = new ResponseBody(200, 'OK');
        res.status(responseBody.statusCode).json(responseBody);
    })
}

export default routes;