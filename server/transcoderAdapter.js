/**
 * Created by Dlimbu
 */

var _JVM = require("java");

var TranscoderAdapter = function (options) {
   this._inst = null;
};

TranscoderAdapter.prototype.startJVM = function () {
   _JVM.classpath.push("./src");
   this._inst = _JVM.newInstanceSync("TestTranscoder");
};

TranscoderAdapter.prototype.getName = function (cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }
   var _res = "";

   _JVM.callMethod(this._inst, "getName", function (err, result) {
      if (err) {
         console.log("Error received");
         _res = err;
      } else {
         console.log("Returned data " + result);
         _res = result;
      }
      cbfn (_res);
   });
};

TranscoderAdapter.prototype.transcode = function (fileName, format, toFormat, cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }
   self._inst.muxSync("../myJava/", fileName, format, toFormat);
   cbfn();
};

TranscoderAdapter.prototype.dispose = function () {
   _JVM = null;
   this._inst = null;
};

exports.TranscoderAdapter = TranscoderAdapter;