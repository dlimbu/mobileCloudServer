/**
 * Created by Dlimbu
 */

var express = require('express');
//var TranscoderAdapter = require('./transcoderAdapter').TranscoderAdapter;
var ImageMagickAdapter = require('./imageMagickAdapter').ImageMagickAdapter;
var morphType = require('./imageMagickAdapter').morphType;

var fs = require('fs');
var bp = require('body-parser');

var OlServer = function (options) {
   this._sInst = express();
   this._tAdapter = new ImageMagickAdapter();
};

OlServer.prototype.init = function () {
   this._sInst.use(bp.json({limit: '50mb'}));
   this._sInst.use(bp.urlencoded({limit: '50mb', extended: true}));
};

OlServer.prototype.transcodeEndpoint = function (options) {
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

OlServer.prototype.morphOutEndpoint = function (options) {
   var _self = this;
   this._sInst.get('/morph/morphIn.jpg', function (req, res) {
      var outFile = "morphIn.jpg";

      res.sendFile(__dirname +"/"+ outFile, options, function (err) {
         if (err) {
            console.log("Error sending file: ", err);
            res.status(err.status).end();
         } else {
            res.status(200);
            console.log("File GET response complete.");
         }
      });
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

      _self._tAdapter.morph(morphType.DILATE, inFile, inFile, function () {
         var elapsed = Date.now() - t;
         var absPath = __dirname +"/"+ inFile;

         console.log("sending file: " + absPath);
	      console.log("Morph dilate duration(ms): "+ elapsed);

         res.sendFile(absPath, options, function (err) {
            if (err) {
               console.log("Error sending file: ", err);
               res.status(err.status).end();
            } else {
               res.status(200);
               console.log("File POST response complete.");
            }
         });
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
      res.sendStatus(200);
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
