/**
 * Created by Dlimbu
 */

var express = require('express');
var TranscoderAdapter = require('./transcoderAdapter').TranscoderAdapter;
var ImageMagickAdapter = require('./imageMagickAdapter').ImageMagickAdapter;

var OlServer = function (options) {
   this._sInst = express();
   this._tAdapter = new ImageMagickAdapter();
};

OlServer.prototype.getReqEndPoint = function (options) {
   var _self = this;
   this._sInst.get('/', function (req, res) {
      console.log("get received calling transcode");
      var t = Date.now();
      _self._tAdapter.transcode("mirage", "png", "jpg", function (result) {
         var elapsed = Date.now() - t;
         res.send('Welcome to Offload Server! duration transcoding (MS): '+ elapsed)
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
