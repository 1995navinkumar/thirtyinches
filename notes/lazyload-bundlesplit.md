## Lazyloading and Bundlesplitting
Done through `react-router` and `vite`. most effective.  

Dynamic imports in Routes file make vite code split based on that and react-router can load the components lazily
without compromising **prefetch** capabilities

### Static imports -- all are bundled togther and loaded together
```
import XComponent, {xLoader, xAction} from './x'
<Route 
  path='/'
  loader={xLoader},
  action={xAction},
  Component={<XComponent/>}
>
</Route>
```
All are bundled together and run togther. loader call is prefetched (avoids waterfall)



### All Dynamic imports -- 
```
<Route 
  path='/'
  loader={async() => {
    return await import('./x-loader');
  }},
  lazy={async() => {
    let action = await import('./x-action');
    let Component = await import('x-component');
    return { action, Component}

  }}
>
</Route>
```
Bundling: 
Individual files are split here. ie. no bundling, each file is lazyloaded. 

Render-fetch: 
loader, action, component files are imported parallely. once imported, js executes and api calls are made. 
Now since calls are made after file downloads, loaders run little late, since it has to download and run.
No real benefit here in render-fetch waterfall.


### Static Loader import, Dynamic (action + componet) Preferred
```
import xLoader from './x-loader'
<Route 
  path='/'
  loader={xLoader},
  lazy={async() => {
    let { xAction: action, xComponent: Component } = await import('./x-action-component');
    return { action, Component}
  }}
>
</Route>
```
If loaders are small (most cases) it is bundled along with main bundle. And action+componet (singlefile) is extracted
into its own bundle. (code split)
This way we can achieve code-splitting, also achieve complete parallelisation between loader and action+component.

> Note: For codesplitting to work, while doing dynamic imports, the imported function should be in a separate file. 
> if you use dynamic import on a specific export and make others static imports, then code splitting is not done.



Given these, it better to structure our app in this way
```
module/componet
  - loader.js
  - Component-Action.jsx or index.jsx (preferred)
  - route.jsx // 
```
> It make sense to keep the action coupled to the component.

Ref: https://remix.run/blog/lazy-loading-routes
