var assert = require('assert');
var SimpleTree = module.parent.exports.require('./lib/simple_tree');

module.exports = {
  testDescendant : function(){
    var tree = new SimpleTree();

    tree.push("_a","_b");
    tree.push("_b","c");

    var result = tree.getChildren("c");
    assert.deepEqual(["_b"], result);

    var result = tree.getDescendant("c");
    assert.deepEqual(["_b", "_a"] , result);
  }
}
