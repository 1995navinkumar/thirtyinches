import { rest } from 'msw';
import { delayRes } from './utils';

import localforage from "localforage";
import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

const host = 'http://localhost:4000'

function set(contacts) {
  return localforage.setItem("contacts", contacts);
};


const getContacts = rest.get(`${host}/api/contacts`, async function(req, res, ctx) {
  const { q: query } = Object.fromEntries(req.url.searchParams);
  let contacts = await localforage.getItem('contacts');
  if(!contacts) contacts = [];
  if(query) {
    contacts = matchSorter(contacts, query, {keys: ["first", "last"]});
  };
  let contactList = contacts.sort(sortBy("last", "createdAt"));
  return delayRes(
    ctx.status(200),
    ctx.json(contactList)
  );
});

const createContact = rest.post(`${host}/api/contacts/create`, async function(req, res, ctx) {
  let contact = req.body;
  let contacts = await localforage.getItem('contacts');
  if(!contacts) contacts = [];
  contacts.unshift(contact);
  await set(contacts);
  return delayRes(
    ctx.status(200),
    ctx.json(contact)
  );
  
})

const getContact = rest.get(`${host}/api/contacts/:id`, async function(req, res, ctx) {
  let { id } = req.params;
  let contacts = await localforage.getItem('contacts');
  let contact = contacts.find(contact => contact.id === id);
  return delayRes(
    ctx.status(200),
    ctx.json(contact)
  )

});

const updateContact = rest.put(`${host}/api/contacts/:id`, async function(req, res, ctx) {
  let { id } = req.params;
  let updates = req.body;
  let contacts = await localforage.getItem("contacts");
  let contact = contacts.find(contact => contact.id === id);
  if (!contact) throw new Error("No contact found for", id);
  Object.assign(contact, updates);
  await set(contacts);
  return delayRes(
    ctx.status(200),
    ctx.json(contact)
  );
});

const deleteContact = rest.delete(`${host}/api/contacts/:id`, async function(req, res, ctx) {
  let { id } = req.params;
  let contacts = await localforage.getItem("contacts");
  let index = contacts.findIndex(contact => contact.id === id);
  let deleteStatus = false;
  if (index > -1) {
    contacts.splice(index, 1);
    await set(contacts);
    deleteStatus = true;
  };
  return delayRes(
    ctx.status(200),
    ctx.json({status: deleteStatus})
  )
});

const deleteContactError = rest.delete(`${host}/api/contacts/:id`, async function(req, res, ctx) {
  return delayRes(
    ctx.status(500),
    ctx.json({status: false})
  );
});

const handlers = [
  getContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact,
];

export default handlers;
