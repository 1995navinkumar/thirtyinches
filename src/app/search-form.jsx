import { Form } from 'react-router-dom';
export function SearchForm() {
  return (
    <Form id="search-form" role="search">
      <input
        id="q"
        aria-label="Search contacts"
        placeholder="Search"
        type="search"
        name="q"
      />
      <div id="search-spinner" aria-hidden hidden={true} />
      <div className="sr-only" aria-live="polite"></div>
    </Form>
  );
}
