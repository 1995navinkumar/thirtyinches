/**
 * Native forms
*/
import { 
  useOutletContext ,
  useLoaderData
} from 'react-router-dom';

export function loader({request}) {
  console.log(request.url);
  
  //return request.url;
  return new Response(request.url);
}

export function LinkSample() {
  let context = useOutletContext();
  let loaderData = useLoaderData();
  return (
    <div>
      <p>{loaderData}</p>
    </div>
  )
}
