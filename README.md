This is an experimental source-to-source compiler that understands basic JavaScript and offers two extra language features on top. The compiler is bootstrapped (able to compile itself) and written in only 1k lines of code.

I created this project to give a basic, not too much 
time-consuming overview, how source-to-source compilers like [Babel](https://github.com/babel/babel) work behind the scenes.

### Overview:
````bin/stub```` contains the latest generated version (the "compiler.exe")  
````src/index```` contains the compiler source code we can edit (gets compiled by our stub)

### Usage:
````c
node build
````

### Features:

##### Pass by reference:
````js
// variables get passed by value in js -
// with 'inout' we tell the compiler to transform passed in variables into a referenceable object before
function swap(inout a, inout b) {
  let tmp = a;
  a = b;
  b = tmp;
};
let test1 = 5;
let test2 = 10;
console.log(test1, test2); // 5, 10
swap(test1, test2); // swap both variables
console.log(test1, test2); // 10, 5
````
Compiles into:
````js
function swap(a, b) {
  let tmp = a.$iov;
  a.$iov = b.$iov;
  b.$iov = tmp;
};
let test1 = { $iov: 5 };
let test2 = { $iov: 10 };
console.log(test1.$iov, test2.$iov); // here we point to the variable's value
swap(test1, test2); // here we pass the variable's reference
console.log(test1.$iov, test2.$iov); // much hax
````
##### Enums:
````js
enum Direction {
  Up = 0,
  Down,
  Left,
  Right
}
let dir = .Up || Direction.Right;
````
Compiles into:
````js
var Direction;
(function(Direction) {
  Direction[Direction['Up'] = 0] = 'Up';
  Direction[Direction['Down'] = 1] = 'Down';
  Direction[Direction['Left'] = 2] = 'Left';
  Direction[Direction['Right'] = 3] = 'Right';
})(Direction || (Direction = {}));
let dir = 0 || 3;
````

### How it works:

The first version of the compiler was written in very simple javascript, using only explicitly necessary language features. The compiler got extended more and more until it was able to parse the required subset of javascript language features, which are needed to parse and transform strings. In the next step the code generator got added which spits out plain javascript without any formatting. This code then turned into the stub file as well as remains our source file. Now it was easy to add new features to the source file. To add a new feature, we have to *blindly* extend the compiler without using the new feature in the compiling process, but we can test the new feature at the end of the source file. As soon as no errors gets thrown in the bootstrapping process, we can make use of our new added language feature directly inside our compiler source.

### Stub usage:
````js
let compiler = require("./bin/stub");
compiler.compile("const a = 10;", {
  console: console, // uses log and error method
  error: function(msg) {
    console.error("Error: " + msg); // wat happens on a error
  }
});
````

See [toy-compiler](https://github.com/maierfelix/toy-compiler) for a more extended version offering classes and a simple preprocessor.

Another compile-to-js project is [this](https://github.com/maierfelix/hevia-compiler) one, which offers a [Swift](https://developer.apple.com/swift/)-like language with type inference, custom operators, pass-by-reference etc.