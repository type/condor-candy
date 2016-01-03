var https = require('https');

function doSomething(eventData){
console.log(eventData);
}

var options = {
  hostname: 'systest.digitallife.att.com',
  port: 443,
  path: '/messageRelay/pConnection?uuid=14517900804645&app2="""&key=998E391B05D54A83B1BFEC206BBBDC11',
  method: 'GET'
};

var req = https.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        if (chunk.indexOf('*') == -1 ){
            doSomething(JSON.parse(chunk.substring(0, chunk.indexOf('"""'))));
        }
    });
});

req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
req.end();
