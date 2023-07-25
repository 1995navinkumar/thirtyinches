import { Link } from "react-router-dom";

export function ContactList({ contacts }) {

  if (!contacts.length) {
    return (
      <p>
        <i>No contacts</i>
      </p>
    );
  }
  return (
    <ul>
      {contacts.map((contact) => (
        <li key={contact.id}>
          <Link to={`contacts/${contact.id}`}>
            {contact.first || contact.last ? (
              <>
                {contact.first} {contact.last}
              </>
            ) : (
              <i>No Name</i>
            )}{" "}
            {contact.favorite && <span>★</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
