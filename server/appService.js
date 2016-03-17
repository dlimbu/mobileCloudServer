/**
 * Created by Dlimbu on 3/10/16.
 */

var OlServer = require('./OlServer').OlServer;

var olServer = new OlServer();
olServer.getReqEndPoint();
olServer.postReqEndPoint();

olServer.start(8080);
