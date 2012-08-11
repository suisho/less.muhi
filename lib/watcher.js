var fs = require('fs');
var watchTree = require('fs-watch-tree').watchTree;

// private var
var previousEvent;
var changeCallback = function(){};


var Watcher = function(directory){
  this.directory = directory;
};

Watcher.prototype = {
  directory : null,
  duplicateBlockTime : 100,

  changeCallback : function (file){
  },

  start : function(){
    var self = this;
    watchTree(self.directory,{},function(event){
      if(event.isDirectory()){
        return;
      }
      if(event.isDelete()){
        return;
      }

      var now = (new Date()).getTime();

      //Block duplicate
      if(previousEvent && previousEvent.name == event.name){
        if(now - previousEvent.time < duplicateBlockTime){
          //console.log("duplicate skip ");
          return;
        }
      }

      //refresh previousEvent
      previousEvent = event;
      previousEvent.time = now;

      // fire change
      changeCallback(file);
    });
  }
}

module.exports = Watcher;
