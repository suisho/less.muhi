var assert = require("assert");
var ReplaceRule = module.parent.exports.require("./lib/less/replace_rule");

module.exports = {
  testReplace : function(){
    var rep = new ReplaceRule();
    rep.add("hoge","fuga");
    rep.add(".less",".cnv.css");
    var result = rep.replace("hoge.less");
    var expect ="fuga.cnv.css";
    assert.equal(expect, result);
  },
  testRegexpReplace : function(){
    var rep = new ReplaceRule();
    rep.add(/.less$/,".cnv.css");

    var result = rep.replace("less.less");
    var expect ="less.cnv.css";
    assert.equal(expect, result);
  }
}
