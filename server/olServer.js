/**
 * Created by Dlimbu
 */

var express = require('express');
var TranscoderAdapter = require('./transcoderAdapter').TranscoderAdapter;
var ImageMagickAdapter = require('./imageMagickAdapter').ImageMagickAdapter;
var morphType = require('./imageMagickAdapter').morphType;

var fs = require('fs');
var bp = require('body-parser');

var OlServer = function (options) {
   this._sInst = express();
   this._tAdapter = new ImageMagickAdapter();
};

OlServer.prototype.init = function () {
   this._sInst.use(bp.json());
   this._sInst.use(bp.urlencoded({extended:true}));
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
 * @param options
 */
OlServer.prototype.morphDilateEndPoint = function (options) {
   var _self = this;
   this._sInst.post('/morph/dilate', function (req, res) {
      var inFile = "morphIn.jpg";
      var outFile = "morphOut.jpg";

      var ws = fs.createWriteStream("morphIn.jpg");
      req.pipe(ws);

      var t = Date.now();
      _self._tAdapter.morph(morphType.DILATE, inFile, outFile, function () {
         var elapsed = Date.now() - t;
         console.log("sending file: " + (__dirname +"/"+ outFile));
         res.sendFile(__dirname +"/"+ outFile)
      });
   });
};

/**
 * @param options
 */
OlServer.prototype.transcode = function (options) {
   this._sInst.post('/transcode', function (req, res) {
      var ws = fs.createWriteStream("image.jpg");
      req.pipe(ws);
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
