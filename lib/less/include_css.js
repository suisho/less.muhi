/**
 * include_css.js
 * Convert @import "some.css"
 */

var path = require('path');
var fs = require("fs");
IncludeCss = {};
/**
 * Extend @import
 * @param  {String} css   css content string
 * @param  {Array}  paths import resolve path
 * @return {String}       extended css
 */
IncludeCss.extend = function(css, paths){
  var regexp = /@import\s.+;/g
  var importMatches = css.match(regexp);
  if(importMatches == null){
    return css;
  }

  for(var i=0; i < importMatches.length ; i++){
    css = this.replaceImport(css, paths, importMatches[i]);
  }

  return css;
}

IncludeCss.replaceImport = function(css, paths, importSyntax){
  // @see less.js/parser.js
  var fileRegexp = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/;
  if(fileRegexp.test(importSyntax) == false){
    return css;
  }

  var matches = importSyntax.match(fileRegexp);
  var fileName = matches[1] || matches[2];
  if(/\.css$/.test(fileName) == false){
    return css;
  }

  var filePath = this.resolvePath(fileName, paths);
  if(filePath){
    var cssString = fs.readFileSync(filePath,'utf8');
    css = css.replace(importSyntax, cssString);
  }
  return css;
}

/**
 * Find exist file.
 * @see less/lib/index.js
 * @param  {String} file  Search file
 * @param  {Array}  paths Search paths
 * @return {String}
 */
IncludeCss.resolvePath = function(file, paths){
  var pathname;

  paths.unshift('.');
  for (var i = 0; i < paths.length; i++) {
    try {
      pathname = path.join(paths[i], file);
      fs.statSync(pathname);
      break;
    } catch (e) {
      pathname = null;
    }
  }
  return pathname;
}

exports.IncludeCss = IncludeCss;
