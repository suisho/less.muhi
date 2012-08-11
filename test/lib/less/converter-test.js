var assert = require("assert");
var fs = require("fs");
var path = require("path");
var Converter = module.parent.exports.require("./lib/less/converter.js");
var paths = ["./test/mock/convert_test"];

module.exports = {
  setUp : function(){
    fs.unlink("./test/mock/convert_test/convert_test_result.less");
  },
  testIsSameFilePath : function(){
    var converter = new Converter(paths);
    assert(converter.isSameFilePath("hoge/fuga","hoge\\fuga"));
    assert(converter.isSameFilePath("hoge\\fuga","hoge/fuga"));
    assert(converter.isSameFilePath("./hoge/fuga","./hoge/../hoge/fuga"));
  },
  testParse : function(){
    var converter = new Converter(paths);
    converter.parse("convert_test.less",function(err, destFilePath, imports){
      var dir = ["test","mock","convert_test"].join(path.sep);
      var hogeCssPath = dir+path.sep+["hoge.css"]
      var mixinPath   = dir+path.sep+["mixin.less"]
      var mixin2Path   = dir+path.sep+["mixin2.less"]
      assert.deepEqual(imports,[mixinPath, mixin2Path, hogeCssPath])
    })
  },
  testconvertSingleFile : function(){
    var converter = new Converter(paths);
    converter.outputFileRule.clear();
    converter.outputFileRule.add(".less","_result.css");
    converter.convertSingleFile("convert_test.less",function(err, destFilePath, imports){
      var result = fs.readFileSync(destFilePath,"utf8");
      var expect = fs.readFileSync("./test/mock/convert_test/convert_test_expect.css","utf8");
      assert.equal(result,expect);
    });
  }
}
