var dl = require('./digitalLife'),
    async = require('async'),
    _ = require('underscore');


//Heat less than 68
function heatRule(callback){
    dl.getDeviceGUID('thermostat', function(err, results) {
        async.parallel({
            'heat-setpoint': _.bind(dl.getDeviceAttribute, dl, 'heat-setpoint', results[0].deviceGuid),
            'thermostat-mode': _.bind(dl.getDeviceAttribute, dl, 'thermostat-mode', results[0].deviceGuid),
            'temperature': _.bind(dl.getDeviceAttribute, dl, 'temperature', results[0].deviceGuid),
        }, function(err, results){
            if (err) {
                return callback(err, null);
            } else {
                if (results['thermostat-mode'].content.value.indexOf('heat') === -1) {
                    callback(null, 0);
                } else {
                    var heatSetpoint = dl.tempConvert(results['heat-setpoint'].content.value);
                    if (heatSetpoint <= 68) {
                        callback(null, 1);
                    } else {
                        callback(null, -1);
                    }
                }
            }
        });
    });
}

function acRule(callback){
    dl.getDeviceGUID('thermostat', function(err, results) {
        async.parallel({
            'cool-setpoint': _.bind(dl.getDeviceAttribute, dl, 'cool-setpoint', results[0].deviceGuid),
            'thermostat-mode': _.bind(dl.getDeviceAttribute, dl, 'thermostat-mode', results[0].deviceGuid),
            'temperature': _.bind(dl.getDeviceAttribute, dl, 'temperature', results[0].deviceGuid),
        }, function(err, results){
            if (err) {
                return callback(null, 0);
            } else {
                if (results['thermostat-mode'].content.value.indexOf('cool') === -1) {
                    callback(null, 0);
                } else {
                    var coolSetpoint = dl.tempConvert(results['cool-setpoint'].content.value);
                    if (coolSetpoint >= 78) {
                        callback(null, 1);
                    } else {
                        callback(null, -1);
                    }
                }
            }
        });
    });
}


function windowRule(callback){
    var getDevicesAttribute = function (device, attribute, callback, result){
        async.map(_.pluck(result[device], 'deviceGuid'), _.bind(dl.getDeviceAttribute, dl, attribute), callback);   
    }; 
   
    async.auto({
        thermostat: _.bind(dl.getDeviceGUID, dl, 'thermostat'),
        windows: _.bind(dl.getDeviceGUID, dl, 'contact-sensor'),
        thermostatStatus: ['thermostat', _.partial(getDevicesAttribute, 'thermostat', 'thermostat-mode')],
        windowStatus: ['windows', _.partial(getDevicesAttribute, 'windows', 'contact-state')]
    }, function(err, results){
        if (err) {
            return callback(null, 0);
        } else {
            if (results.thermostatStatus[0].content === 'off') {
                return callback(null, 0);
            } else {
                var count = _.countBy(results.windowStatus, function(window){ return (window.content.value)});
                callback(null, (count.open === undefined)? 1 : -1);
            }
        }
    });
}

function checkPoints(callback){
    async.parallel({
        heatRule: _.partial(heatRule),
        acRule: _.partial(acRule),
        windowRule: _.partial(windowRule)
    }, callback);
};

exports.checkPoints = checkPoints;
