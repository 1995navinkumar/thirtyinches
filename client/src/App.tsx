import React, { useEffect } from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import ErrorPage from './error-page';
import Home, { homeLoader, homeAction } from './routes/Home';
import AppRoutes from './routes/index';
import { selectUser, userAuthStateAction } from './redux/user';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path='/'
      loader={homeLoader}
      action={homeAction}
      element={<Home />}
      errorElement={<ErrorPage />}
    >
      {AppRoutes}
    </Route>

  )
)

function App({ AppStore }) {
  const { getState } = AppStore;
  const user = selectUser(getState());

  console.log(user);

  useEffect(() => {
    AppStore.dispatch(userAuthStateAction());
  }, [])

  return (
    <RouterProvider router={router} />
  )
}

export default App
