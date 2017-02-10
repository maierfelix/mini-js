This is a tiny (~1k LOC) self-hosted compiler, which is able to compile itself.

 * bin/stub contains the latest generated version (and compiles src/index)
 * src/index contains the compiler source, written in minimal/customized js

### Features:
The compiler only offers one extra language feature (**enums**) to stay small and simple:
````js
enum Direction {
  Up = 0,
  Down,
  Left,
  Right
}
let dir = .Up || Direction.Down; // before compiling
let dir = 0 || 3; // after compiling, unfolded
````
Everything else is just plain minimal es5.

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

See [toy-compiler](https://github.com/maierfelix/toy-compiler) for a more extended version offering classes, a simple preprocessor etc.