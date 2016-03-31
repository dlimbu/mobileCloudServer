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
   });

   cbfn();
};

exports.ImageMagickAdapter = ImageMagickAdapter;
