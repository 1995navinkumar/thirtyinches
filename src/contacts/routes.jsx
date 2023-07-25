//import Contact, {contactLoader, deleteContactAction } from './index.jsx';
import { contactLoader } from './contact-loader';

/*for code splitting loader should be placed in a separate file*/
//import { contactLoader } from './index.jsx';
import ContactForm, {updateContactAction} from './contact-form.jsx';
import {
  Route
} from 'react-router-dom';

const routes = (
  <>
    <Route
      path='contacts/:contactId'
      loader={contactLoader}
      lazy={async () => {
        let { Contact: Component, deleteContactAction: action } = await import('./index.jsx');
        return {
          action,
          Component,
        }
      }}
    >
    </Route>
    <Route
      path='contacts/:contactId/edit'
      loader={contactLoader}
      action={updateContactAction}
      element={<ContactForm />}
    >
    </Route>
  </>
);

export default routes;

/*
action={deleteContactAction}
element={<Contact/>}
*/
