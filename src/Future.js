/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Future.js                                              *
 *                                                        *
 * hprose Future for HTML5.                               *
 *                                                        *
 * LastModified: May 4, 2015                              *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (global) {
    'use strict';

    global.hprose = global.hprose || Object.create(null);

    global.hprose.Completer = function Completer() {
        var callback = null;
        var errorCallback = null;
        var results = [];
        var errors = [];
        var future = Object.create(null);

        function complete(result) {
            if (callback) {
                callback(result);
            }
            else {
                results.push(result);
            }
        }

        function completeError(error) {
            if (errorCallback) {
                errorCallback(error);
            }
            else {
                errors.push(error);
            }
        }

        function then(handler) {
            callback = handler;
            if (results.length > 0) {
                var result;
                for (var i in results) {
                    try {
                        result = callback(results[i]);
                    }
                    catch (e) {
                        completeError(e);
                    }
                }
                results = [result];
            }
            return future;
        }

        function catchError(errorHandler) {
            errorCallback = errorHandler;
            if (errors.length > 0) {
                for (var i in errors) {
                    errorCallback(errors[i]);
                }
                errors = [];
            }
            return future;
        }

        Object.defineProperties(future, {
            then: { value: then },
            catchError: { value: catchError },
        });

        Object.defineProperties(this, {
            future: { get: function() { return future; } },
            complete: { value : complete },
            completeError: { value : completeError }
        });
    };

})(this);
