var fs = require("fs");
var assert = require("assert");

var includeCss = require("../../../lib/less/include_css.js").IncludeCss;
var paths = ["./test/mock/include_test"];

var extendCssString = fs.readFileSync("./test/mock/include_test/extend_test.css","utf-8");
var extendCssStringExpect = fs.readFileSync("./test/mock/include_test/extend_test_result.css","utf-8");
var hogeCssString   = fs.readFileSync("./test/mock/include_test/hoge.css","utf-8");

// test
var convertPatterns =[
    '@import "hoge.css";',
    "@import 'hoge.css';",
];
var notConvertPatterns = [
    '@import url(http://fonts.googleapis.com/css?family=Open+Sans);',
    '@import "not_resolve_file.css"'
];

module.exports = {
    // resolvePath
    testResolvePath : function(){
        var paths = ["not_found_path","./test/mock/include_test"]
        var resolve = includeCss.resolvePath("hoge.css",paths);
        var expect = "test\\mock\\include_test\\hoge.css" //TODO
        assert.equal(expect,resolve);
    },
    testResolvePathFalse : function(){
        var resolve = includeCss.resolvePath("not_resolve_file.css",paths);
        assert.equal(null,resolve);
    },
    testReplaceimport : function(){
        // replaceImport
        convertPatterns.forEach(function(item){
            console.log("* Test "+item);
            var cssString = includeCss.replaceImport(item, paths, item);
            assert.equal(hogeCssString, cssString);
        })
    },
    testNotReplaceImport : function(){
        notConvertPatterns.forEach(function(item){
            console.log("* Test "+item);
            var cssString = includeCss.replaceImport(item, paths, item);
            assert.equal(item, cssString);
        })
    },
    testExtend : function(){
        // extend
        var result = includeCss.extend(extendCssString, paths);
        assert.equal(extendCssStringExpect, result);
    }
}
