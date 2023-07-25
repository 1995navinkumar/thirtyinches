import {Route} from 'react-router-dom';
import { RouterForms } from './index.jsx';
import {LinkSample, loader as linkLoader } from './link/index.jsx';


const route = (
  <Route
    path="/forms"
    element={<RouterForms/>}
  >
    <Route
      index={true}
      loader={linkLoader}
      element={<LinkSample/>}
    >
    </Route>
  </Route>
);

export default route;
