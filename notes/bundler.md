## why vite? 
Before going there I will talk about other bundlers I have worked with

### Browserify
Browserify is my favourite bundler mostly because of its design principle and the idea of 
streaming the data over each process. 
- Simple, it resolves its dependency through node require calls and for non-js files through transforms 
- writes to stdout/file
- No in-built dev-server or hmr but has watch mode
- Since it just outputs to file, we can do all sorts of customisation around the bundle 
ie. having a index.html with assets from different sources, serviceworkers, css just like normal web.
- There is no difference between build and watch mode. both writes to the same file/location.

### Webpack
- Complicated webpack config with loader and rules
- Bundler that supports all features at the cost of complexity and performance
- dev-server spins up on the fly. its doesn't write to a file all are in-memory.
there is little transparency in knowing what files were bundled and how are they bundled.
- Build files has hashes which again is difficult to understand which module they represent

### esbuild
Esbuild is similar to browserify. except its much faster and had all the user-land transforms/plugins
built-in. This makes esbuild run with less configuration, where as browserify needs user-land transforms
for each one of them.
Like browserify it writes to file/stdout. Its upto us to have a server, html files etc
 
HMR is not supported (which im completely fine with that). I would prefer esbuild for my personal projects, and projects
which requires basic bundling capabilities (which should be the case, adding more toolchains will impact the perf)
Im eagerly waiting for code-splitting with esbuild. if thats lauched, i will use vite build with esbuild completely

### Parcel
Parcel is very fast, sometimes faster than vite since it bundles the dependencies and loads them.
It has lightning-css for bundling/splitting css. which is again very fast than vite
Only problem I had was its Zero config and sometimes when i get a build error I dont konw 
where the problem is.


### Vite
Vite has two modes. DEV mode, Build mode
Dev mode uses a dev-server 
Source codes are all tranformed on the fly using babel/swc converts to ES modules 
and leverages the browser support for import to load modules in the browser
Library dependencies are pre-bundles using esbuild and are loaded as a single file to 
avoid multiple http calls

Although, ES modules imports are sometimes slower when large no.of js, css files are loaded,
I still prefer this because this is close to the platform. At somepoint, I believe we would not 
require any bundlers and browsers should be able to run our code direclty

Build Mode: 
This is where it gets little confusing. vite relies on rollup to do build. which means
dev mode and build mode is not using the same pipeline/process.
This sometime causes confusion because dev mode works fine but build would fail or vice-versa

This also requires you to have the knowledge of two bundlers, vite and rollup. vite is abstracting most of the 
configuration that is needed for build, but sometimes we are ending up with some rollup specfic plugins for the build.
And there is always a confusion, whether the plugin is applied to which mode.


Also since vite uses rollup for build, build time is equivalent to what we have for webpack.
This is not preferred setup for me although we will not often build during dev time but we may build may times in CI/CD 


I wish to have a same toolchain for both Dev and build mode with only optimization configs on build
Since we are using esbuild for dev mode, if esbuild figured out the code splitting, we can use 
vite - dev - swc/babel - esbuild
vite - build - esbuild 

Im not sure if we need swc, esbuild also can transform and bunlde. but i guess tranform logic alone is not exposed i guess
Or vice versa, use swc + swcpack for esbuild

