/**
 * Created by Dlimbu
 */

var express = require('express');
//var TranscoderAdapter = require('./transcoderAdapter').TranscoderAdapter;
var ImageMagickAdapter = require('./imageMagickAdapter').ImageMagickAdapter;
var morphType = require('./imageMagickAdapter').morphType;
var transformType = require('./imageMagickAdapter').transformType;

var fs = require('fs');
var bp = require('body-parser');

var IN_FILE = "morphIn.jpg";
var _ts;
var _i = 0;
var _serverDurations = { procTime: [] };

var OlServer = function (options) {
   this._sInst = express();
   this._tAdapter = new ImageMagickAdapter();
};

OlServer.prototype.init = function () {
   this._sInst.use(bp.json({limit: '50mb'}));
   this._sInst.use(bp.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000}));
};

OlServer.prototype._readIStream = function (req) {
   var ws = fs.createWriteStream(IN_FILE);
   req.pipe(ws);
   _ts = Date.now();
};

OlServer.prototype._writeOStream = function (res) {
   var elapsed = Date.now() - _ts;
   _serverDurations.procTime[_i++] = elapsed;
   var absPath = __dirname +"/"+ IN_FILE;
   console.log("sending file: " + absPath);
   console.log("Morph dilate duration(ms): "+ elapsed);
   res.sendFile(absPath, {}, function (err) {
      if (err) {
         console.log("Error sending file: ", err);
         res.status(err.status).end();
      } else {
         res.status(200);
         console.log("File POST response complete.");
      }
   });
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

OlServer.prototype.GETDurationEndpoint = function (options) {
   var _self = this;
   this._sInst.get('/durations', function (req, res) {
      res.setHeader("Content-Type", "application/json");
      _serverDurations.total = _serverDurations.procTime.length;
      res.send(JSON.stringify(_serverDurations));
      _i = -1;
   });
};

/**
 * Morph out GET endpoint for last processed image.
 * @param options
 */
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

var _resetDurationTrack = function () {
   if (_i == -1) {
      _i = 0;
      _serverDurations = {procTime:[]};
   }
};

/**
 * Morph dilate POST end point
 * @param options
 */
OlServer.prototype.morphDilateEndPoint = function (options) {
   var _self = this;

   this._sInst.post('/morph/dilate', function (req, res) {
      _resetDurationTrack();
      _self._readIStream(req);
      _self._tAdapter.morph(morphType.DILATE, IN_FILE, IN_FILE, function () {
         _self._writeOStream(res);
      });
   });

   this._sInst.post('/morph/erode', function (req, res) {
      _resetDurationTrack();
      _self._readIStream(req);
      _self._tAdapter.morph(morphType.ERODE, IN_FILE, IN_FILE, function () {
         _self._writeOStream(res);
      });
   });

   this._sInst.post('/morph/edge', function (req, res) {
      _resetDurationTrack();
      _self._readIStream(req);
      _self._tAdapter.morph(morphType.EDGE, IN_FILE, IN_FILE, function () {
         _self._writeOStream(res);
      });
   });
};

/**
 * Transform POST end point.
 */
OlServer.prototype.transformEndpoint = function () {
   var self = this;
   this._sInst.post('/transform/spread', function (req, res) {
      _resetDurationTrack();
      self._readIStream(req);
      self._tAdapter.transform(transformType.SPREAD, IN_FILE, IN_FILE, function () {
         self._writeOStream(res);
      });
   });

   this._sInst.post('/transform/vignette', function (req, res) {
      _resetDurationTrack();
      self._readIStream(req);
      self._tAdapter.transform(transformType.VIGNETTE, IN_FILE, IN_FILE, function () {
         self._writeOStream(res);
      });
   });

   this._sInst.post('/transform/charcoal', function (req, res) {
      _resetDurationTrack();
      self._readIStream(req);
      self._tAdapter.transform(transformType.CHARCOAL, IN_FILE, IN_FILE, function () {
         self._writeOStream(res);
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
