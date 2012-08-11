// DestRule
var ReplaceRule = function(rules){
  rules = rules || {};
  this.init(rules)
};
ReplaceRule.prototype = {
  _rules : {},
  init : function(rules){
    this.clear();
    for(var from in rules){
      var to = rules[from];
      this.add(from,to);
    }
  },
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
