import {getContact} from '../service';

export async function contactLoader({request, params}) {
  let contact = await getContact(params.contactId);
  return contact;
};
