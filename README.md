This is a tiny (~1k LOC) self-hosted compiler, which is able to compile itself.

 * bin/stub contains the latest generated version (and compiles src/index)
 * src/index contains the compiler source, written in minimal/customized js

### Features:
The compiler only offers two language features on top to stay small and simple:
<<<<<<< HEAD

<details>
  <summary>Enums:</summary>

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
=======

<details>
  <summary>Enums:</summary>

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
</details>
<details>
  <summary>Pass by reference:</summary>

>>>>>>> origin/master
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
</details>
<details>
  <summary>Pass by reference:</summary>

````js
// variables get passed by value in js -
// with 'inout' we tell the compiler to transform our variable into a object,
// since objects are getting passed by reference. All following variable
// accesses get transformed to point to the object's value property
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
console.log(test1.$iov, test2.$iov);
swap(test1, test2);
<<<<<<< HEAD
console.log(test1.$iov, test2.$iov); // much hax
=======
console.log(test1.$iov, test2.$iov);
>>>>>>> origin/master
````
</details>

### How it works:

The first version of the compiler was written in very simple javascript, using only explicitly necessary language features. The compiler got extended more and more until it was able to parse the required subset of javascript language features, which are needed to parse and transform strings. In the next step the code generator got added which spits out plain javascript without any formatting. This code then turned into the stub file as well as remains our source file. Now it was easy to add new features to the source file. To add a new feature, we have to *blindly* extend the compiler without using the new feature in the compiling process, but we can test the new feature at the end of the source file. As soon as no errors gets thrown in the bootstrapping process, we can make use of our new added language feature directly inside our compiler source.

### Building:
````c
node build
````
The build script only updates the stub if no errors gets thrown when compiling the  source file.

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

<<<<<<< HEAD
Another compile-to-js project is [this](https://github.com/maierfelix/hevia-compiler) one, which offers a [Swift](https://developer.apple.com/swift/)-like language with type inference, custom operators, pass-by-reference etc.
=======
Another compile-to-js project is [this](https://github.com/maierfelix/hevia-compiler) one, which offers a [Swift](https://developer.apple.com/swift/)-like language with type inference, custom operators, pass-by-reference etc.
>>>>>>> origin/master
