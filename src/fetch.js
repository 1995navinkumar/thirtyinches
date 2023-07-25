const jsonifyOpts = function(opts) {
  let { body } = opts;
  if(!body) return opts;
  body = JSON.stringify(body);
  return {
    headers: {
      'Content-Type': 'application/json',
    },
    ...opts,
    body
  }
};

const getResponseError = async function(response) {
  let { status, statusText } = response;
  let e = Object.assign(Error(statusText), {status});
  let data;
  try {
    // data is expected to be an error json {message, name, ...}
    data = await response.json();
  } catch(e) {
    // error in parsing json
    return e;
  }
  return Object.assign(e, data);
}



export default function createFetchJson(baseUrl, defaultOpts={}) {
  return function fetchJson(resource, opts) {
    let url = baseUrl + resource;
    opts = {...defaultOpts, ...opts};
    opts = jsonifyOpts(opts);
    return fetch(url, opts)
      .then(async response => {
        let { ok, statusText } = response;
        if(!ok) {
          throw await getResponseError(response);
        };
        return await response.json();
      })
  }
}
