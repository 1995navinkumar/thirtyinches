## Classical Client-Server Architecture
Client communicate to Server through HTML Forms
HTML Forms create a HTTP Request that is sent over the wire to Server which can understand the Request and respond 
back with Response (an HTML page to render) 

The Response HTML is treated as a new Page and rendered completely new


## <form action='/search'></form>
Creates a **Request**  with url and form values are added as query params
```
url: /search?query-params
method: GET (implicit)
```


## <form action='/search' method='POST/PUT/DELETE'></form>
Creates a **Request**  with url and form values are added as query params
```
url: /search
method: POST
body: FormData (object)
```

## <form method='POST/PUT/DELETE'></form>
Creates a **Request**  with url and form values are added as query params
```
url: current page url
method: POST
body: FormData (object)
```

Server has *handlers* for each of these urls and peforms the necessary action and respond back with an HTML response
with the same url or different url(redirection)

## <a href='/any'> vs <form action='/any'/>
Here Both creates a GET requests. so functionality wise they both do the same. Server gives the same response.  
One difference is the purpose 
<a> - is used to represent any statis resources, cannot take user input
<form> is used to get user input 


## Ajax 
Request sent from Form is prevented using e.preventDefault() and http api call is made without changing 
the url and updates only the component


## React Router
React router acts as server with handlers like *loader* and *action* functions.   

loader handler is called for GET Request, and any navigation events (forms)  
action handler is called for POST/PUT/DELETE Requests  

Both handlers take a Request and can respond with a Response object. 
> Note: Handlers can return any data type. but its better to visualise as Response

## loader, useLoaderData
- Loaders are called for GET Requests <Link>, <Form GET/>, or any navigation
- They are called parallely outside of the render cycle. 
- They can also be lazyLoaded, outside the main bundle.
- when a route is navigated, all loaders (parent/child) loaders are called parallely avoiding the render-fetch waterfall


## action, useActionData
- action is called for POST/PUT/DELETE Requests <Form POST|PUT|DELETE />
- when <Form action='/search'/> is submitted, React router loads the route /search and calls its action handler with 
the Form request.

## fetcher.Form
similar to <Form> without action -- except this is specifically for cases where form submission shouldn't cause 
navigation. No history affected.


## Hooks 
### useNavigation
All navigation events (from Link, Form) are captured and useNavigation hook provides states during the transition

### useNavigate vs redirect
Both cause navigation programmatically within code when navigation cannot be done thru Link/Form  
Case - auth/logout redirection, action redirection
- use redirect inside loader/actions where a Response is expected. redirect is wrapper around Response
- use usNavigate for other places.


## why React Data router ? 
Data router using <Form><Link> with action and loader is providing us a framework to organize the app which in turn
handles few things out of the box
- Data Revalidation/Synchronisation (removes useEffect call)  based on <Form> events
- Error Handling
- Navigation states
- Avoids Render-Fetch waterfall
- LazyLoading and bundle splitting
- Race conditions
- Scroll Restoration


## Things to keep in mind before using Data routers. 
The full benefit of Data routers are reaped only when our application is setup to leverage it. 
This means having good understanding of our application data, how are they organized, how are we mapping to app urls. 

Devs need to have a clear understanding like what can go into <Form action /> , what needs navigation and what doesn't

Given Component which manages a list -- most UI cases. 
To populate data to components -- use loaders  
For any user action, try to capture them with <Form>  
```
let loader = function() {
  return records
};

let action = function({request}) {
  switch(request.method) {
    ....
  }

}

let Component = (
  <section>
    <Form method='POST'>Create Record</Form> // action on the same route
    <Table list={records}>
      <Form method='PUT' />
      <Form method='DELETE' />
      <List/>
    </Table>
  </section>
)
```

A Page/Route is loaded based on two navigation events. 
- <Link> only loader is called. action is not called
- <Form action='route'> action is called. Loader? 

A route's action is called only when its called through <Form action> component.
A route's loader is called for any navigation event. (Link, Form)

## Note Revalidation/Synchronisation: 
Whenever a <Form> is submitted, Router assumes a app state change (like how server sends a new page) automatically 
calls all loaders that are visible on the page.   
This is really useful, but we need to check if it calls loaders that are not dependent/related to the Form action submitted. 
Eg: User profile on root level getting called for any action in the child route.  
In those case use `shouldRevalidate` function on the route to tell the router if the loader should be called or not for 
revalidation  
Since App synchronisation is a important feature. allow the app to revalidate and look for any unintended calls where we 
can add `shouldRevalidate` as an *optimization*   


Its always better to have all child routes related to Parent, to avoid unnecessary revalidations. If a component is not 
related to the route, then better to have it in a separate route. 

This brings one more problem, Slow back button - Having multiple routes is good for organizing data but when user navigates
between the routes, the data is fetched for each navigation - which is sometimes costly and not a good UX. 
To combat this, we can use caching layers so we can have instant back button - optimistic UI.
(more on this later)


## Note on action, useActionData
Action can be submitted to the same route <Form method=''/> or to a different route <Form action='xyz'/>

Usually action are submitted to the same route, and the components gets the data thru `useActionData` hook.

Eg: 
```
function action({request}) {
  let query = request.formData();
  let results = await getDbResults(query);
  return results;

}

function Component()  {
  let data = useActionData();
  <Form method='post'>
   {...complex search query input }
  <Form/>
  <Table data={data} />

}
```
loader/useLoader can be used to fetch a default query. 
action/useActionData is used for user specific query.

Q: when action is called, does current route loader is also called? 

Q: When do we call action on some other route? 
<Form action='show-list'>
show-list route might display some list based on default query. but if we are in some page when we submit page with 
some specific query requirements, we can call the `show-list` action with our formData, which will get rendered based on 
the action call.





