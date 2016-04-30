/**
 * Created by Dlimbu on 3/30/16.
 */
var exec = require('child_process').exec;

var ImageMagickAdapter = function (options) {
   this._inst = null;
};

ImageMagickAdapter.prototype.transcode = function (fileName, format, toFormat, cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }
	
   var cmd = "convert ../myJava/"+ fileName +"." + format +
      " ../myJava/"+fileName+"."+toFormat;
   console.log("command line exec: " + cmd);
   exec(cmd ,function (error, stdout, stderr) {
      cbfn();
   });
};

ImageMagickAdapter.prototype.morph = function (type, inFile, outFile, cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }

   var cmd;
   switch(type) {
      case morphType.DILATE:
         cmd = "convert " + inFile + " -morphology Dilate Octagon:3 "+ outFile;
         break;
      case morphType.ERODE:
         cmd = "convert " + inFile + " -morphology Erode Octagon:3 "+ outFile;
         break;
      case morphType.EDGE:
         cmd = "convert " + inFile + " -morphology Edge Octagon:3 "+ outFile;
         break;
   }

   console.log("command line exec: " + cmd);

   exec(cmd ,function (error, stdout, stderr) {
      cbfn();
   });
};

ImageMagickAdapter.prototype.transform = function (type, inFile, outFile, cbfn) {
   if(!cbfn) {
      throw Error("Invalid parameter, cbFn required");
   }

   cbfn();
};

var morphType = {
   DILATE: "dilate",
   ERODE: "erode",
   EDGE: "edge"
};

exports.morphType = morphType;
exports.ImageMagickAdapter = ImageMagickAdapter;
