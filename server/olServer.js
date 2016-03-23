/**
 * Created by Dlimbu
 */

var express = require('express');
var TranscoderAdapter = require('./transcoderAdapter').TranscoderAdapter;


var OlServer = function (options) {
   this._sInst = express();
   console.log("TranscoderAdapter class: ", TranscoderAdapter);
   this._tAdapter = new TranscoderAdapter();
   this._tAdapter.startJVM();
};

OlServer.prototype.getReqEndPoint = function (options) {
   var _self = this;
   this._sInst.get('/', function (req, res) {
      console.log("get received calling transcode");
      var t = Date.now();
       _self._tAdapter.transcode("xLarge", "jpg", "png",function (result) {
	var e = Date.now();
	var elapsed = e-t;
         res.send('Welcome to Offload Server! duration transcoding: '+ elapsed)
      }.bind(this));
   });
};

/**
 *
 * @param options
 */
OlServer.prototype.postReqEndPoint = function (options) {
   this._sInst.post('/', function (req, res) {
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
