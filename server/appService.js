/**
 * Created by Dlimbu on 3/10/16.
 */

//const nativeHello = require('../build/Release/hello');
//console.log("NativeHello: " + nativeHello.hello());
var fs = require('fs');
process.env.UV_THREADPOOL_SIZE = 80;
console.log("POOL SIZE: "+process.env.UV_THREADPOOL_SIZE);

var OlServer = require('./olServer').OlServer;

var olServer = new OlServer();
olServer.init();

olServer.transcodeEndpoint();
olServer.morphDilateEndPoint();
olServer.morphOutEndpoint();
olServer.transformEndpoint();
olServer.GETDurationEndpoint();
olServer.start(8080);
