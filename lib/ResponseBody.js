/**
 * Defines a standard data structure for the response of any request
 */

'use strict'

export class ResponseBody {
    constructor(statusCode, message, data) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}