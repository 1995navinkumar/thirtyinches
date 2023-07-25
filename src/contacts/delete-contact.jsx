import { Form,  redirect } from "react-router-dom";
import {deleteContact} from '../service';

export async function deleteContactAction({request}) {
  let formData = await request.formData();
  let { contactId } = Object.fromEntries(formData);

  await deleteContact(contactId);
  return redirect("/");
};

export default function DeleteContact({contactId}){
  let handleSubmit = (e) => {
    if (
      !confirm(
        "Please confirm you want to delete this record."
      )
    ) {
      e.preventDefault();
    }
  }

  return (
    <Form
      method="delete"
      onSubmit={handleSubmit}
    >
      <button type="submit" name='contactId' value={contactId}>Delete</button>
    </Form>
  )
}
