var options = { year: 'numeric', month: 'short', day: 'numeric' };
var formatter = new Intl.DateTimeFormat('en-us', options);

export function formatDate(date) {
    return formatter.format(date);
}