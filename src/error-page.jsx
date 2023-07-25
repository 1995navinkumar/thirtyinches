/**
 * useRouteError will provide errors thrown by any component when navigating
 * Throws Response Error if its coming from api or Error object
*/

import { useRouteError } from 'react-router-dom'
export default function ErrorPage() {
  /** @type {Error|Response}*/
  const error =  useRouteError();
  return (
    <div id="error-page">
      <h2>Oops!</h2>
      <p> <i>{error.statusText}</i></p>
      <p> <i>{error.message}</i></p>
    </div>
  )


}

