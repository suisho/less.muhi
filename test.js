var path = require("path");
var color = require("colors");
var util = require("util");
var fsExtednd = require("./lib/fs_extend");
// setting
var failOnError = true;
var detail = true;

__console_log = console.log;
console.log = function(message){
  if(detail){
    __console_log(message);
  }
}
//module.paths.push(path.resolve("./app/lib"));
//console.log(module.paths);

exports.require = function(path){
  return require(path);
}

function testing(testName, testFunc, failOnError){
  console.log("Test ".magenta + testName);
  try{
    testFunc();
  }catch(e){
    success = false;
    var inspect = util.inspect(e);
    console.error(inspect.red);
    //console.trace();
    if(e.actual && e.expected){
      var diff = require("difflet")({"indent":2});
      diff(e.actual, e.expected).pipe(process.stdout);
    }
    if(failOnError){
      throw e;
    }
  }
  if(success){
    console.log(" => success".green);
  }
  return success;
}

function cleanConsle(){
  var lines = process.stdout.getWindowSize()[1];
  for(var i = 0; i < lines; i++) {
      console.log('\r\n');
  }
}

var testCount = 0;
var successCount = 0;

var tests = fsExtednd.lsRecursive("./test");
cleanConsle();
try{
  for(var i=0; i < tests.length; i++){
    var testFile = tests[i];
    if(/-test.js/.test(testFile) == false){
      continue;
    }
    var success = true;

    console.log("Start test:".cyan +testFile);
    var testClass = require(testFile);

    var setUp = testClass.setUp || function(){};
    var tearDown = testClass.tearDown || function(){};

    for(var methodName in testClass){
      var func = testClass[methodName];
      if(typeof(func) !== "function"){
        continue;
      }
      if(/test.*/.test(methodName) == false){
        continue;
      }

      //Testing!
      setUp();
      var success = testing(methodName, func, failOnError);
      tearDown();
      testCount++;
      if(success){
        successCount++;
      }
    }
    console.log("End test:".cyan +testFile+"\n");
  }
  detail = true;
  console.log("Test Result: (successs/all) "+ successCount+"/"+ testCount+"\n");
  if(successCount == testCount){
    console.log("Congraturation! All Green!".green);
  }else{
    var failCount = testCount - successCount;
    console.log("Failed !".red);
    console.log("Failed !!".red);
    console.log("Failed !!!".red);

    console.log("Faild "+ failCount+" tests");
  }
}catch(e){
  throw e;
  //console.error(e.toString().red.bold);
}
