import { Form, useLoaderData, redirect, useNavigate } from "react-router-dom";
import { updateContact } from '../service';

export async function updateContactAction({request, params}) {
  const formData = await request.formData();
  let update = Object.fromEntries(formData);
  await updateContact(params.contactId, update);
  // util that creates Response with redirected url.
  return redirect(`/contacts/${params.contactId}`);
  //return Response.redirect(`/contacts/${params.contactId}`);
}


export default function ContactForm() {
  const contact = useLoaderData(); // defaults
  const navigate = useNavigate();

  const handleCancel = function(e) {
    navigate(-1) // back button
  }

  return (
    <Form method="post" id="contact-form">
      <p>
        <span>Name</span>
        <input
          placeholder="First"
          aria-label="First name"
          type="text"
          name="first"
          defaultValue={contact.first}
        />
        <input
          placeholder="Last"
          aria-label="Last name"
          type="text"
          name="last"
          defaultValue={contact.last}
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          type="text"
          name="twitter"
          placeholder="@jack"
          defaultValue={contact.twitter}
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          placeholder="https://example.com/avatar.jpg"
          aria-label="Avatar URL"
          type="text"
          name="avatar"
          defaultValue={contact.avatar}
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          name="notes"
          defaultValue={contact.notes}
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </p>
    </Form>
  );
}
