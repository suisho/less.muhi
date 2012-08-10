
var path = require("path");
var color = require("colors");
var util = require("util");
//module.paths.push(path.resolve("./app/lib"));
//console.log(module.paths);
var tests = [
  "./test/lib/less/include_css-test.js"
];

function testing(testName, testFunc){
  console.log("Test ".magenta + testName);
  try{
    testFunc();
  }catch(e){
    success = false;
    console.log(util.inspect(e).red);
    console.log(e.stack);
  }
  if(success){
    console.log("success".green);
  }
}

for(var i=0; i < tests.length; i++){
  var testFile = tests[i];
  var success = true;

  console.log("Start test:".cyan +testFile);
  var test = require(testFile);
  for(var key in test){
    var item = test[key];
    if(typeof(item) !== "function"){
      continue;
    }
    if(key.match(/test.*/)){
      testing(key, item);
    }
  }
  console.log("End test:".cyan +testFile);

}
