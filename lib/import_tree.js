
var DuplicateError = new Error();

/**
 *  @importの関連性を保つ
 */
var ImportTree = function(){
  this.hash = {}
};
ImportTree.prototype = {
  hash : {},
  /**
   *  from importする側
   *  to importされる側
   */
  push : function(from,to){
    var r = [];
    if(this.hash[from]){
      r = this.hash[from];
    }
    r.push(to);
    this.hash[from] = r;
  },
  set : function(from,toList){
    this.hash[from] = toList;
  },
  /** @returns Array*/
  get : function(from){
    return this.hash[from];
  },
  getChildren : function(parent){
    var _children = {};
    for(var from in this.hash){
      if(this.get(from).indexOf(parent) < 0){
        continue;
      }
      _children[from] = 1;
    }
    var children = [];
    //重複除去
    for(var _c in _children ){
      children.push(_c);
    }
    return children;
  },
  getDescendant : function(parent){
    var children = {};
    var searchTarget = [parent];
    do{
      for(var j=0; j < searchTarget.length;j++){
        var _children = this.getChildren(searchTarget[j]);
        for(var i=0; i< _children.length; i++){
          children[_children[i]] = 1;
          searchTarget.push(_children[i]);
        }
      }
    }while(searchTarget.length == 0)
    var descendant = [];
    for(var child in children){
      descendant.push(child);
    }
    return descendant;
  }
}
exports.ImportTree = ImportTree;
