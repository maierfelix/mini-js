let fs = require("fs");
let vm = require("vm");

let stub_path = "./bin/stub.js";
let stub = require(stub_path);

let stdlib = require("./stdlib");

let input = fs.readFileSync("./src/index.jsm", "utf-8");

console.log("Recompiling..");

let result = null;
try {
  result = stub.compile(input, stdlib);
  // add a fake module.exports to the vm ctx
  stdlib.module = {exports:{}};
  // test the recompiled compiler in a vm
  // if we succeed then overwrite the latest stub
  vm.runInNewContext(result, stdlib);
  stdlib.module.exports.compile(input, stdlib);
} catch (e) {
  console.log(e);
  return void 0;
}

fs.writeFileSync(stub_path, result, "utf-8");
console.log("Successfully recompiled into " + stub_path);