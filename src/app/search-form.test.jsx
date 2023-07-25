import test from 'tape';
import {
  domRenderWithRouterProvider,
  LocationDisplay,
} from '../../test/utils'

import { SearchForm }  from './search-form.jsx';


test('<SearchForm/> submit', async assert => {
  let routes = [
    {
      path: "/",
      element: (
        <>
          <SearchForm/>
          <LocationDisplay/>
        </>
      )
    }
  ];
  const { screen, user } = domRenderWithRouterProvider(routes, assert.teardown);
  let searchInput = await screen.getByPlaceholderText('Search');
  {

    let desc = 'Given user input; should display in search input';
    let expected = 'xyz';
    await user.type(searchInput, 'xyz');
    assert.same(searchInput.value, expected, desc);
  }
})
