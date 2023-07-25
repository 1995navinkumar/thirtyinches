## Unit Testing Stack 
- happydom (dom env)
- tape (test runner and assertion)
- react-testing-library (render/query)
- esbuild register  (to convert jsx)

## Happydom
Alternative to jsdom. claims to be faster. I just wanted to try something different

## tape
Tape is a simple test runner with standard assertions.  (well maintained now)
I like to have one test runner for both frontend, backend nodejs, library - tape, riteway is my choice
since riteway, I always go with `deepEquality` assertions and follow the riteway format since its gives me 
better test description
Simple and transparent `Setup` and `Teardown` models through `t.teardown` (eliminates before, beforeEach, after, afterEach hooks)

## react-testing-library
Good mental model, Nice ways to render, query elements. 

## babel | swc | esbuild registers  (to convert jsx)
- babel has good support but slow
- swc is fast, but package size is very high
- esbuild register needs additional steps, but fast and already available in vite (preferred)

> Note: Since `node` doesnt understand `jsx` on its own, we need a runtime transpiler like babel. but using 
> transpilers through *registers* (node -r babel) requires the app to be in commonjs. 
> To work around this, we need to remove `type: module` and transpile everything to commonjs before running in test.
> vite also does the same. 
