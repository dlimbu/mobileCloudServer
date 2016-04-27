/**
 * Created by Dlimbu on 3/10/16.
 */

//const nativeHello = require('../build/Release/hello');
//console.log("NativeHello: " + nativeHello.hello());
var OlServer = require('./olServer').OlServer;
var olServer = new OlServer();
olServer.init();
olServer.getReqEndPoint();
olServer.morphDilateEndPoint();
olServer.start(8080);
