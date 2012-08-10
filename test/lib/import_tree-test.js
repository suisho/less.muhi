var assert = require('assert');
var ImportTree = require('../../lib/import_tree');

module.exports = {
    testDescendant : function(){
        var tree = new ImportTree();

        tree.push("_a","_b");
        tree.push("_b","c");

        var result = tree.getChildren("c");
        assert.deepEqual(["_b"], result);

        var result = tree.getDescendant("c");
        assert.deepEqual(["_b", "_a"] , result);
    }

}
