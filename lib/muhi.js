/**
 * 
 */
var path = require('path');
var colors = require('colors');

var SimpleTree = require('./simple_tree');
var Converter  = require('./less/converter');
var Watcher    = require('./watcher');

// private;

function isLessFile(file){
  return /.+.less$/.test(file);
}

// protoype
var Muhi = function(targetPath){
  this.targetPath = targetPath;
};
Muhi.prototype = {
  targetPath : null,
  importTree : new SimpleTree(),
  lessConverter : new Converter(),
  watcher : new Watcher(),
  debug : false,
  log : function(message){
    if(debug){
      console.log(message);
    }
  },

  isIgnoreFile : function(filePath){
    return false;
  },

  writeCallback : function(func){
    this.setFunction(func, writeCallback);
  },

  isOutputFile : function(filePath){
    return true
  },

  init : function(){
    this.importTree    = new ImportTree();
    this.watcher       = new Watcher(this.targetPath);

    this.lessConverter = new Converter([this.targetPath]);
    this.lessConverter.eventEmitter.on('write_file', writeFileCallback);
  },

  startWatch :function(){
    var self = this;
    self.init();

    var files = require("./fs_extend").lsRecursive(self.targetPath);
    files.forEach(function(file){-
      self.convert(file);
    });

    self.watcher.setChangeCallback(function(file){
      self.propagatingConvert(file);
    });
  },

  convertOnce : function(){
    this.init();
    var files = require("./fs_extend").lsRecursive(this.targetPath);
    files = files.filter(this.isConvertTarget);
    this.lessConverter.convertMulti(files, function(){});
  },

  /**
   *  convert one file with propagation
   *  @param String filePath
   */
  propagatingConvert :function(filePath){
    var convertResult = this.convert(filePath);
    if(convertResult == false){
      return;
    }
    if(propagation){
      var children = exports.importTree.getDescendant(filePath);
      for(var i=0; i < children.length ; i++){
        this.convert(children[i]);
      }
    }
  },

  /**
   *  process one file
   */
  convert : function(sourceFilePath){
    var self = this;

    if(isLessFile(sourceFilePath) == false){
      return false;
    }

    var execFunc = null;
    if(self.isConvertTarget(sourceFilePath) ){
      execFunc = self.lessConverter.convert;
    }else{
      execFunc = self.lessConverter.parse;
    }

    execFunc(sourceFilePath, function(error, destFilePath, imports) {
      self.log("from:"+sourceFilePath.green);
      if(destFilePath){
        self.log("to  :"+ destFilePath.red);
      }
      sourceFilePath = path.normalize(sourceFilePath);
      if(error){
        self.log(sourceFilePath);
        self.log(error);
      }

      if(imports){
        // parent -> file , child -> imports
        exports.importTree.set(file, imports);
      }
    });
    return true;
  }
}
module.exports.Muhi = Muhi;
//module.exports.MuhiOnce = MuhiOnce;
