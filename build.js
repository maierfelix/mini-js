let fs = require("fs");

let stdlib = require("./src/stdlib");

let stub_path = "./bin/stub.js";
let stub = fs.readFileSync(stub_path, "utf-8");

let input = fs.readFileSync("./src/index.jsm", "utf-8");

console.log("Compiling..");

let output = null;

try {
  let exports = {};
  new Function("__imports", "__exports", stub)(stdlib, exports);
  output = exports.compile(input);
  new Function("__imports", "__exports", output)(stdlib, exports);
  exports.compile(input);
} catch (e) {
  console.log(e);
  console.log("Compilation failed!");
}

fs.writeFileSync(stub_path, output, "utf-8");
console.log("Compilation succeeded!");