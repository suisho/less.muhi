// DestRule

var ReplaceRule = function(){};
ReplaceRule.prototype = {
  _rules : [],
  clear : function(){
    this._rules = []
  },
  add : function(pattern, replacement){
    this._rules.push({
      "pattern" : pattern,
      "replacement" : replacement
    });
  },
  /*get : function(from){
    return this._rules[from];
  },*/
  replace : function(filePath){
    //normalize
    filePath = filePath.replace(/\\/g,"/");
    for(var i=0; i < this._rules.length; i++){
      var rule = this._rules[i];
      filePath = filePath.replace(rule.pattern,rule.replacement);
    }
    return filePath;
    //return path.resolve(filePath);
  }
}

module.exports = ReplaceRule;
