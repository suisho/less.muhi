var assert = require("assert");
var fsExtend = module.parent.exports.require("./lib/fs_extend");

module.exports = {
  testLsRecursive : function(){
    var actual = fsExtend.lsRecursive("./test/mock/ls_recursive");
    var expect = [
      "./test/mock/ls_recursive/dir/dir/file4",
      "./test/mock/ls_recursive/dir/file3",
      "./test/mock/ls_recursive/file1",
      "./test/mock/ls_recursive/file2",
    ];
    assert.deepEqual(actual, expect);
  }
}
