var fs = require('fs');
var watchTree = require('fs-watch-tree').watchTree;

// private var
var previousEvent;


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
        if(now - previousEvent.time < self.duplicateBlockTime){
          //console.log("duplicate skip ");
          return;
        }
      }

      //refresh previousEvent
      previousEvent = event;
      previousEvent.time = now;

      // fire change
      self.changeCallback(event.name);
    });
  }
}

module.exports = Watcher;
