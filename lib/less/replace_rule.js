// DestRule
var ReplaceRule = function(init){
  init = init || {};
  this._rules = init;
};
ReplaceRule.prototype = {
  _rules : {},
  clear : function(){
    this._rules = {}
  },
  add : function(from,to){
    this._rules[from] = to;
  },
  get : function(from){
    return this._rules[from];
  },
  //旧getDestPath
  replace : function(filePath){
    //normalize
    filePath = filePath.replace(/\\/g,"/");
    destRules = this._rules;
    for(var from in destRules){
      var to = this.get(from);
      filePath = filePath.replace(from ,to);
    }
    return filePath;
    //return path.resolve(filePath);
  }
}

module.exports = ReplaceRule;
