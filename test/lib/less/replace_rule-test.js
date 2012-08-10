var assert = require("assert");

var ReplaceRule = require("../../../lib/less/replace_rule.js");
module.exports = {
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
