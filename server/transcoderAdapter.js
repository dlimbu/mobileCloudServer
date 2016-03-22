/**
 * Created by Dlimbu
 */

var _JVM = require("java");

var TranscoderAdapter = function (options) {
   this._inst = null;
   this._tCoderClass = null;
};

TranscoderAdapter.prototype.startJVM = function () {
   _JVM.classpath.push("./src");
   this._tCoderClass = _JVM.import("TestTranscoder");

   console.log("Transcoder import done !!!! " + this._tCoderClass.testSync());
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

TranscoderAdapter.prototype.transcode = function (path, cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }
   var _res = "";
   var self = this;
   console.log("calling loadImageSync ..");
   try {
      self._inst.loadImageSync();
   } catch (ex) {

   }

   console.log("calling transcodeSync ..");
   self._inst.transcodeSync("png");

   cbfn();

};

TranscoderAdapter.prototype.openFD = function (cbFn) {

   var self = this;
//   var name = self._inst.getFilePathSync();
//   console.log("getFilePath .." + name);
//   console.log("calling muxSync ..");
//   var _res;
//   try {
//      self._inst.muxSync("./","large","jpg","png");
//   } catch (ex) {
//      console.log(ex.cause.getMessageSync());
//   }

   console.log("done muxing ..");
//   console.log("FilePath " + self._inst.getFilePathSync());

   console.log("Jar directory: " + self._inst.getUserDirSync());
   self._inst.openFDSync("../myJava/","large","jpg");

   var file = self._inst.getFileSync();

   console.log("Got the file descriptor");
   var imageBuffer =_JVM.callStaticMethodSync("javax.imageio.ImageIO", "read", file);


   console.log("Done calling read !!!!");

//   console.log("FilePath " + self._inst.getFilePathSync());

//   console.log("getUseCache: " + self._inst.getUseCacheSync());

   console.log("calling loadImageSync ..");
//   try {
//      self._inst.loadImageSync();
//   } catch (ex) {
//      console.log("calling loadImageSync ..", ex);
//   }

   console.log("calling transcodeSync ..");
   self._inst.transcodeSync("png");

   cbFn();


};

TranscoderAdapter.prototype.dispose = function () {
   _JVM = null;
   this._inst = null;
};

exports.TranscoderAdapter = TranscoderAdapter;


//   _JVM.callMethod(self._inst, "openFD", "", "large", "jpg", function (err, result) {
//      if (err) {
//         console.log("Error openFD received", err);
//         _res = err;
//         cbFn();
//         return;
//      } else {
//         console.log("openFD Returned data " + result);
//         _res = result;
//      }
//
////      _JVM.callMethod(self._inst, "getFilePath", function (err, result) {
////         console.log("FilePath " + result);
////      });
//      cbFn();
//   });
//   var _transcode = function (cbFn) {
//      self._inst = _JVM.newInstanceSync("TestTranscoder");
//      console.log("calling transcode ..");
//      _JVM.callMethod(self._inst, "transcode", "png", function (err, result) {
//         if (err) {
//            console.log("Error loadImage received", err);
//            _res = err;
//            cbFn();
//            return;
//         } else {
//            console.log("loadImage Returned data " + result);
//            _res = result;
//         }
//
//         console.log("Transcode successfull!!");
//         cbFn();
//      });
//   };
//
////   self._inst = _JVM.newInstanceSync("TestTranscoder");
//   console.log("calling _loadImgg ..", _JVM.isJvmCreated());
//   console.log("calling _loadImgg _inst ..",  self._inst.loadImage);
//
////   self._inst = _JVM.newInstanceSync("TestTranscoder");
//   _JVM.callMethod(self._inst, "loadImage", function (err, result) {
//      if (err) {
//         console.log("Error loadImage received", err);
//         _res = err;
//         cbfn();
//         return;
//      } else {
//         console.log("loadImage Returned data " + result);
//         _res = result;
//      }
//      console.log("Load image successfull!!");
//      _transcode(cbfn);
//   });
//
//   console.log("calling loadImage ..");