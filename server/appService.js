/**
 * Created by Dlimbu on 3/10/16.
 */

//var OlServer = require('./olServer').OlServer;

const nativeHello = require('../build/Release/hello');
console.log("NativeHello: " + nativeHello.hello());

var exec = require('child_process').exec;
var t = Date.now();
exec("convert ../myJava/mirage.png ../myJava/mirage.jpg", function (error, stdout, stderr) { });
console.log("Total transcoding time: " + (Date.now() - t));

//var olServer = new OlServer();
//olServer.getReqEndPoint();
//olServer.start(8080);
