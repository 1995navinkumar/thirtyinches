import createFetchJson from './fetch';

const fetchJson = createFetchJson('http://localhost:4000');

export async function getContacts(query) {
  if (query) {
    return fetchJson(`/api/contacts?q=${query}`, { method: 'GET'});
  }
  return fetchJson(`/api/contacts`, { method: 'GET'});
};

export async function createContact() {
  let id = Math.random().toString(36).substring(2, 9);
  let contact = { id, createdAt: Date.now() };
  return fetchJson('/api/contacts/create', {method: 'POST', body: contact});
}

export async function getContact(id) {
  return fetchJson(`/api/contacts/${id}`, {method: 'GET'})
}

export async function updateContact(id, updates) {
  return fetchJson(`/api/contacts/${id}`, {method: 'PUT', body: updates})
}

export async function deleteContact(id) {
  return fetchJson(`/api/contacts/${id}`, {method: 'DELETE'}).then(results => {
    return results.status;
  });
}


