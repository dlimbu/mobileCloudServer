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

   exec("convert ../myJava/"+ fileName +"." + format +
      "../myJava/"+fileName+"."+toFormat, function (error, stdout, stderr) {
   });

   cbfn();
};

exports.ImageMagickAdapter = ImageMagickAdapter;
