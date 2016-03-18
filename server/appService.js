/**
 * Created by Dlimbu on 3/10/16.
 */

var OlServer = require('./olServer').OlServer;

var olServer = new OlServer();
olServer.getReqEndPoint();
olServer.start(9200);
