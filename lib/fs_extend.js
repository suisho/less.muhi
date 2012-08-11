var fs = require('fs');
exports.lsRecursive = function(dir, filterRegExp){
  var list = [];
  return listFile(list, dir, filterRegExp);
}

/**
 * Summary
 * @param	{Array}	  list			結果
 * @param	{String}	path			捜索パス
 * @param	{RegExp}	filterRegExp	対象にする正規表現
 * @returns	{Array}					結果
 */
function listFile(list, path, filterRegExp){
  var _dir = fs.readdirSync(path);
  _dir.forEach(function(item){
    var fullPath = path + "/" +item;
    var stat = fs.statSync(fullPath);
    if(filterRegExp){
      if(filterRegExp.test(path) == false){
        return;
      }
    }
    if(stat.isFile()){
      list.push(fullPath);
    }
    if(stat.isDirectory()){
      listFile(list, fullPath);
    }
  });
  return list;
}
