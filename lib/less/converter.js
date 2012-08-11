/**
 *  Convert (or only parse import) Multiple or Single file.
 */
var sync = require('synchronize');
var path = require('path');
var fs   = require('fs');
var less = require('less');
var events = require('events');
var colors = require('colors');

var ReplaceRule = require('./replace_rule');

// private values
//

var cssOptionDefault = { includeCss : true};
//
// private methods
//

//create parser
function CreateParser(paths){
  var clonedPaths = paths.concat() //deep copy
  var parser = new(less.Parser)({
    paths : clonedPaths
  });

  return parser;
}

function resolvePath(file, paths){
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

var Converter = function(paths){
  this.paths = paths;
};
Converter.prototype ={
  outputFileRule : new ReplaceRule({".less" : ".css"}),
  paths : [],
  eventEmitter :  new events.EventEmitter(),
  toCssOption : {},
  debug : false,
  /**
   * Getter paths (return deep copy)
   */
  getPaths : function(){
    return this.paths.concat(); // deep copy
  },

  log : function(message){
    if(debug == false) return;
    console.log(message);
  },

  convertMultiFiles : function(files, callback){
    var self = this;
    //init parser
    var parser = CreateParser(self.getPaths());
    //setup fiber
    sync(self, '_convert');
    sync(parser, 'parse');
    sync(fs, 'writeFile','readFile');
    //start fiber
    sync.fiber(function(){
      files.forEach(function(file){
        self.log("s:"+ file.red);
        self._convert(parser, file, false);
        self.log("g:"+ file.green);
      })
      console.log("end".red);
      callback();
    });
  },

  convertSingleFile : function(file, callback){
    var parser = CreateParser(this.getPaths());
    this.convert(parser, file, false, callback);
  },

  /**
   * parse (without file output)
   */
  parse : function(file, callback){
    var parser = CreateParser(this.getPaths());
    this.convert(parser, file, true, callback);
  },

  convert : function(parser, file, withoutOutput, callback){
    var self = this;
    callback = callback || function(){};
    file = self._resolvePath(file);

    var error = null;
    var imports = [];
    try{
      // read less file
      var lessString = fs.readFileSync(file,"utf8").toString();
      parser.parse(lessString, function(parseError,tree){
        if(parseError) throw parseError;
        // get imports
        imports = self.getImports(tree, self.getPaths());
        if(withoutOutput == false){
          var destFilePath = self.getDestFilePath(file);
          var cssString = self.treeToCss(tree);

          fs.writeFile(destFilePath, cssString);
          self.eventEmitter.emit("write_file", destFilePath, file, cssString, imports);
        }
        callback(error, destFilePath, imports);
        self.eventEmitter.emit("success", destFilePath, imports);
      });
    }catch(e){
      error = e;
      callback(error);
      self.eventEmitter.emit("error",error);
    }
  },

  treeToCss : function(tree){
    var toCssOption = this.toCssOption;
    var cssString = tree.toCSS(toCssOption);
    if(toCssOption.includeCss){
      var includeCss = require("./include_css").IncludeCss;
      cssString = includeCss.extend(cssString, this.getPaths());
    }
    return cssString;
  },

  getDestFilePath : function(sourceFilePath){
    var destFilePath = this.outputFileRule.replace(sourceFilePath);
    if(destFilePath == sourceFilePath){
      // TODO: throw Error Object
      throw "Same dest and source file. from:"+sourceFilePath+" to:"+destFilePath;
    }
    return this._resolvePath(destFilePath);
  },

  /**
   *  Get import file from tree
   */
  getImports : function(tree, paths){
    var imports =[];
    var _tree = require("less/lib/less/tree");
    tree.rules.forEach(function(rule){
      // TODO: more good practice
      if(rule.hasOwnProperty("css")       == false) return;
      if(rule.hasOwnProperty("path")      == false) return;
      if(rule.hasOwnProperty("once")      == false) return;
      if(rule.hasOwnProperty("feautures") == false) return;

      var importFile = resolvePath(rule.path, paths);
      imports.push(importFile);

    });
    return imports;
  },

  _resolvePath : function(filePath){
    var resolveArgs = this.getPaths();
    resolveArgs.push(filePath); // args ([from...], to);
    return path.resolve.apply(this, resolveArgs);
  }
}

module.exports = Converter;
