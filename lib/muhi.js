/**
 *
 */
var path = require('path');
var colors = require('colors');
var util = require('util');

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
  this.importTree    = new SimpleTree();
  this.watcher       = new Watcher(this.targetPath);
  this.lessConverter = new Converter([this.targetPath]);
};
Muhi.prototype = {
  targetPath : null,
  importTree : new SimpleTree(),
  lessConverter : new Converter(),
  watcher : new Watcher(),
  debug : false,
  executeCount : 0,
  log : function(message){
    if(this.debug){
      console.log(message);
    }
  },

  logError : function(e){
    var errorInspected = util.inspect(e,true,null)+"\n";
    var message = e.message;
    console.error("error".red,
                  errorInspected.red,
                  message.red.bold);
  },

  isIgnoreFile : function(filePath){
    return false;
  },

  writeCallback : function(func){
    this.setFunction(func, writeCallback);
  },

  isOutputTarget : function(filePath){
    return true
  },

  init : function(){
  },

  startWatch :function(){
    var self = this;
    this.lessConverter.eventEmitter.removeListener('write_file', this.writeCallback);
    this.lessConverter.eventEmitter.on('write_file', this.writeCallback);
    var files = require("./fs_extend").lsRecursive(self.targetPath);
    files.forEach(function(file){-
      self.convert(file);
    });

    self.watcher.changeCallback = function(file){
      self.propagatingConvert(file);
    };

    self.watcher.start();
  },

  convertOnce : function(){
    this.init();
    var files = require("./fs_extend").lsRecursive(this.targetPath);
    files = files.filter(this.isOutputTarget);
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
    var children = this.importTree.getDescendant(filePath);
    for(var i=0; i < children.length ; i++){
      this.convert(children[i]);
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
    if(self.isOutputTarget(sourceFilePath) ){
      execFunc = self.lessConverter.convertSingleFile;
    }else{
      execFunc = self.lessConverter.parse;
    }
    self.log("start: "+sourceFilePath.green);
    self.executeCount++;
    execFunc.call(self.lessConverter, sourceFilePath, function(error, destFilePath, imports) {
      self.executeCount--;
      //self.log(self.executeCount);
      if(destFilePath){
        self.log("output:"+ destFilePath.cyan);
      }else{
        self.log("parsed:".grey+ sourceFilePath.grey);
      }
      sourceFilePath = path.normalize(sourceFilePath);
      if(error){
        self.logError(error);
      }

      if(imports){
        // parent -> file , child -> imports
        self.importTree.set(sourceFilePath, imports);
      }
    });

    return true;
  }
}
module.exports.Muhi = Muhi;
//module.exports.MuhiOnce = MuhiOnce;
