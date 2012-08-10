var assert = require('assert');
var importTree = require('../../lib/import_tree');

module.exports = {
    testDescendant : function(){
        var tree = new importTree.ImportTree();

        tree.push("_a","_b");
        tree.push("_b","c");

        var result = tree.getChildren("c");
        assert.deepEqual(["_b"], result);

        var result = tree.getDescendant("c");
        assert.deepEqual(["_b", "_a"] , result);
    }

}