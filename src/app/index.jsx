import { Form, Outlet, useLoaderData } from 'react-router-dom';
import { SearchForm } from './search-form';
import { ContactList } from './contact-list'

import {getContacts, createContact} from '../service';

export function contactsLoader({request}) {
  return getContacts();
};

export function createContactAction({request}) {
  return createContact();
}

export default function App() {
  const contacts = useLoaderData();
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <SearchForm />
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          <ContactList contacts={contacts}/>
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
