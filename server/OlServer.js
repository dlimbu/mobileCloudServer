/**
 * Created by Dlimbu
 */

var express = require('express');

var OlServer = function (options) {
   this._sInst = express();
};

OlServer.prototype.getReqEndPoint = function (options) {
   this._sInst.get('/', function (req, res) {
      res.writeHead(200, {
         'content-Type' : 'text/plain'
      });
      res.send('Welcome to Offload Server!')
   });
};

/**
 *
 * @param options
 */
OlServer.prototype.postReqEndPoint = function (options) {
   this._sInst.post(resource, function (req, res) {
      res.send('Got a POST request');
   });
};

/**
 * Start the process on port.
 * @param port
 */
OlServer.prototype.start = function (port) {
   this._sInst.listen(port, function () {
      console.log("OffLoadServer started...");
   });
};

/**
 * Stop the process/
 */
OlServer.prototype.stop = function () {
   this._sInst.stop();
};

exports.OlServer = OlServer;