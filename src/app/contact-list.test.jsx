import { ContactList } from "./contact-list";
import test from "tape";
import { domRenderWithRouter } from "../../test/utils.jsx";

test("<ContactList contacts={[]}/>", async (assert) => {
  let desc = "Given empty list; should render NoContacts";
  let expected = "No contacts";
  const { screen } = domRenderWithRouter(
    <ContactList contacts={[]} />,
    assert.teardown
  );
  let node = await screen.getByText(/No Contacts/i);
  assert.same(node.innerText.trim(), "No contacts", desc);
});


test("<ContactList contacts={contacts}/>", async (assert) => {
  let desc = "Given list of contacts; should render";
  let contacts = [
    {
      id: "1",
      first: "sandeep",
      last: "kumaar",
    },
  ];
  const { screen } = domRenderWithRouter(
    <ContactList contacts={contacts} />,
    assert.teardown
  );
  let node = await screen.getByText(/sandeep/i);
  assert.same(node.innerText.trim(), "sandeep kumaar", desc);
});
