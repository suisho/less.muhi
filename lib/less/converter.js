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
  toCssOption : { includeCss : true},
  debug : false,
  /**
   * Getter paths (return deep copy)
   */
  getPaths : function(){
    return this.paths.concat(); // deep copy
  },

  log : function(message){
    if(this.debug == false) return;
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
    this._convert(parser, file, false, callback);
  },

  /**
   * parse (without file output)
   */
  parse : function(file, callback){
    var parser = CreateParser(this.getPaths());
    this._convert(parser, file, true, callback);
  },
  //callback -> function(error, destFilePath, imports){}
  _convert : function(parser, file, withoutOutput, callback){
    var self = this;
    callback = callback || function(){};

    //TODO:bad
    try{
      fs.statSync(file)
    }catch(e){
      file = resolvePath(file, self.paths);
    }

    var error = null;
    var imports = [];
    // read less file
    //TODO: readFileError
    var lessString = fs.readFileSync(file,"utf8").toString();
    parser.parse(lessString, function(parseError,tree){
      try{
        if(parseError) throw parseError;
        // get imports
        imports = self.getImports(tree, self.getPaths());
        if(withoutOutput == false){
          var destFilePath = self.getDestFilePath(file);
          var cssString = self.treeToCss(tree);

          fs.writeFileSync(destFilePath, cssString);
          self.eventEmitter.emit("write_file", destFilePath, file, cssString, imports);
        }
        callback(error, destFilePath, imports);
        self.eventEmitter.emit("success", destFilePath, imports);
      }catch(e){
        //console.log(e);
        error = e;
        callback(error);
      }
    });

  },

  treeToCss : function(tree){
    var toCssOption = this.toCssOption;
    var cssString = tree.toCSS(toCssOption);
    if(toCssOption.includeCss){
      cssString = require("./cssinclude").extend(cssString, this.getPaths());
    }

    return cssString;
  },

  isSameFilePath : function(path1,path2){
    var resolve1 = path.resolve(path1);
    var resolve2 = path.resolve(path2);
    if(resolve1 == resolve2){
      return true;
    }
    return false;
  },
  getDestFilePath : function(sourceFilePath){
    var destFilePath = this.outputFileRule.replace(sourceFilePath);
    if(this.isSameFilePath(sourceFilePath,destFilePath)){
      // TODO: throw Error Object
      throw new Error("Same dest and source file."
                      +"\nfrom:"+sourceFilePath
                      +"\nto:  "+destFilePath);
    }
    return destFilePath;
  },

  /**
   *  Get import file from tree
   */
  getImports : function(tree, paths){
    var imports =[];
    var _tree = require("less/lib/less/tree");
    tree.rules.forEach(function(rule){
      // TODO: more good practice
      if(rule.hasOwnProperty("css")       == false) return
      if(rule.hasOwnProperty("path")      == false) return;
      if(rule.hasOwnProperty("once")      == false) return;
      //if(rule.hasOwnProperty("features")  == false) return;

      var importFile = resolvePath(rule.path, paths);
      imports.push(importFile);
    });
    return imports;
  },
}

module.exports = Converter;
