var restify = require('restify'),
    querystring = require('querystring'),
    https = require('https'),
    _ = require('underscore'),
    async = require('async');
    

function DL(userId, appKey) {
    this.client = restify.createJsonClient({
        url: "https://systest.digitallife.att.com",
    }),
    this.userId = userId,
    this.appKey = appKey,
    this.auth = null;


    this.login = function (callback){
        var self = this;
        var parameters = {
            userId: self.userId,
            appKey: self.appKey,
            password: 'NO-PASSWD',
            rememberMe: false
        };
    
        if (! self.auth) {
            self.client.post('/penguin/api/authtokens?' + querystring.stringify(parameters), null,  function(err, req, res, obj) {
                if (! err) {
                    self.auth = obj;
                }
                return callback(err, obj);
            });
        } else {
            return callback(null, self.auth);
        }
    };

    this.gateways = function(callback) {
        var self = this;

        self.login(function(err, results) {
            if (err) {
                return callback(err, null)
            } else {
                return callback(null, self.auth.content.gateways);
            }
        });
    }

    this.gatewayId = function(idx, callback) {
        var self = this;
        
        self.gateways(function(err, results) {
            if (err) {
                return callback(err, null)
            } else {
                return callback(null, results[idx].id);
            }
        });

    }

    this.devices = function(callback) {
        var self = this;

        self.gatewayId(0, function(err, gatewayId){
            if (err) {
                return callback(err, null);
            } else {
                var opts = {
                    path: '/penguin/api/' + gatewayId + '/devices',
                    headers: {
                        authToken: self.auth.content.authToken,
                        requestToken: self.auth.content.requestToken,
                        appKey: self.appKey
                    }
                };
                self.client.get(opts,  function(err, req, res, obj) {
                    return  callback(err, obj.content);
                });
            }
        });
    }

    this.getDeviceGUID = function(deviceType, callback){
        var self = this;

        self.devices(function(err, devices){
            if (err){
                return callback(err, null)
            } else {
                return callback(null, _.where(devices, {deviceType: deviceType}))
            }
        });
    }
    
    this.getDeviceByGUID = function(deviceGUID, callback) {
        var self = this;

        self.gatewayId(0, function(err, gatewayId){
            if (err) {
                return callback(err, null);
            } else {
                var opts = {
                    path: '/penguin/api/' + gatewayId + '/devices/' + deviceGUID,
                    headers: {
                        authToken: self.auth.content.authToken,
                        requestToken: self.auth.content.requestToken,
                        appKey: self.appKey
                    }
                };
                self.client.get(opts,  function(err, req, res, obj) {
                    return  callback(err, obj.content);
                });
            }
        });
    }

    this.setDeviceAttribute = function(attribute, value, deviceGUID, callback) {
        var self = this;
        
        self.gatewayId(0, function(err, gatewayId){
            if (err) {
                return callback(err, null);
            } else {
                var opts = {
                    path: '/penguin/api/' + gatewayId + '/devices/' + deviceGUID + '/' + attribute + '/' + value,
                    headers: {
                        authToken: self.auth.content.authToken,
                        requestToken: self.auth.content.requestToken,
                        appKey: self.appKey
                    }
                };
                self.client.post(opts, null, function(err, req, res, obj) {
                    return  callback(err, obj);
                });
            }
        });
    }
    
    this.getDeviceAttribute = function(attribute, deviceGUID, callback) {
        var self = this;
        
        self.gatewayId(0, function(err, gatewayId){
            if (err) {
                return callback(err, null);
            } else {
                var opts = {
                    path: '/penguin/api/' + gatewayId + '/devices/' + deviceGUID + '/' + attribute,
                    headers: {
                        authToken: self.auth.content.authToken,
                        requestToken: self.auth.content.requestToken,
                        appKey: self.appKey
                    }
                };
                self.client.get(opts, function(err, req, res, obj) {
                    return  callback(err, obj);
                });
            }
        });
    }

    this.events = function(callback){
        var self = this;

        self.gatewayId(0, function(err, gatewayId){
            if (err) {
                return callback(err, null);
            } else {
                var parameters = {
                    uuid: new Date().getTime(),
                    app2: '"""',
                    key: gatewayId
                };
                var options = {
                    hostname: 'systest.digitallife.att.com',
                    port: 443,
                    path: '/messageRelay/pConnection?' + querystring.stringify(parameters),
                    method: 'GET'
                };

                console.log(options);
                var req = https.request(options, function(res) {
                    res.setEncoding('utf8');
                    res.on('data', function (chunk) {
                        if (chunk.indexOf('*') === -1 ){
                            callback(null, 
                                    JSON.parse(chunk.substring(0, chunk.indexOf('"""'))));
                        }
                    });
                });

                req.on('error', function(e) {
                    callback(e, null);
                });

                // write data to request body
                req.end();
            }
        });

    }

    this.tempConvert = function(temp){
        return ((temp / 2 - 40) * 1.8 + 32);
    }
}

module.exports = new DL('553474463', 'KE_3339472F04964023_1');
/*
var dl = new DL('553474463', 'KE_3339472F04964023_1');


dl.events(function(err, evt){
    console.log("Events:", evt);

dl.getDeviceByGUID(evt.dev, function(err, results) {
        console.log(results);
    });
});

dl.getDeviceGUID('light-control', function(err, results) {
    dl.setDeviceAttribute(results[0].deviceGuid, 'switch', 'on', function(err, results){
        console.log(results);
        console.log("That's all folks!");
    });
});
dl.getDeviceGUID('thermostat', function(err, results) {
    dl.getDeviceAttribute(results[0].deviceGuid, 'temperature', function(err, results){
        console.log(dl.tempConvert(results.content.value));
        console.log("That's all folks!");
    });
});
dl.getDeviceGUID('light-control', function(err, results) {
    dl.setDeviceAttribute(results[0].deviceGuid, 'switch', 'off', function(err, results){
        console.log(results);
        console.log("That's all folks!");
    });
});
*/
