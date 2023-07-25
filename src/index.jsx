import { 
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'

import './index.css'
import App, {contactsLoader, createContactAction } from './app';
import contactRoutes from './contacts/routes';
import ErrorPage from './error-page.jsx';

// Routes

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      loader={contactsLoader}
      action={createContactAction}
      element={<App/>}
      errorElement={<ErrorPage/>}
    >
      {contactRoutes}
      
    </Route>

  )
)


const mode = import.meta.env.MODE;
console.log('env mode', mode);

export default function Root() {
  return (
    <RouterProvider router={router}/>
  )

};

