var assert = require("assert");
var ReplaceRule = module.parent.exports.require("./lib/less/replace_rule");

module.exports = {
  testInit : function(){
    var rep = new ReplaceRule({"hoge": "fuga"});
    assert.equal(rep.get("hoge"),"fuga");
    var rule = {
      "a" : "b",
      "c" : "d"
    };
    rep.init(rule);
    assert.equal(rep.get("a"),"b");
    assert.equal(rep.get("c"),"d");
    assert.equal(rep.get("hoge"),null);
  },
  testAdd : function(){
    var rep = new ReplaceRule();
    rep.add("hoge","fuga");
    assert.equal("fuga",rep.get("hoge"));
  },
  testReplace : function(){
    var rep = new ReplaceRule();
    rep.add("hoge","fuga");
    rep.add(".less",".cnv.css");
    var result = rep.replace("hoge.less");
    var expect ="fuga.cnv.css";
    assert.equal(expect, result);
  }
}
