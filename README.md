This is a tiny (1k LOC) self-hosted compiler, which is able to compile itself.

 * bin/stub contains the latest generated version (and compiles src/index)
 * src/index contains the compiler, written in minimal js

Bootstrapping:
````c
edit "src/index"
run "node build"
have fun with "bin/stub"
````

Currently missing:
 - Precedence based expression parsing
