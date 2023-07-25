/**
 * Native forms
*/
import { 
  useOutletContext ,
  useLoaderData,
  Outlet
} from 'react-router-dom';

export function loader({request}) {
  console.log(request.url);
  
  //return request.url;
  return new Response(request.url);
}

export function RouterForms() {
  let context = useOutletContext();
  let loaderData = useLoaderData();
  return (
    <div>
      <div>
        <p>{context.name}</p>
        <p>{context.age}</p>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}
