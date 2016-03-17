/**
 * Created by Dlimbu on 3/10/16.
 */

var OlServer = require('./OlServer').OlServer;

var olServer = new OlServer();
olServer.getReqEndPoint();
olServer.start(8080);
