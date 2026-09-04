document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  function render(query) {
    if (!query.trim()) { results.innerHTML = '<div class="search-empty">Start typing to search the registry.</div>'; return; }
    const matches = IRWR.searchRecords(IRWR_RECORDS, query);
    if (!matches.length) { results.innerHTML = `<div class="search-empty">No records match "${IRWR.escapeHtml(query)}".</div>`; return; }
    results.innerHTML = matches.map((r) => `
      <div class="search-row">
        <img class="photo" src="${IRWR.photoUrl(r, '', 120, 120)}" alt="">
        <div><strong>${IRWR.escapeHtml(r.title)}</strong><div>${IRWR.escapeHtml(r.holderName)} · ${IRWR.escapeHtml(r.country)}</div></div>
        <div>${IRWR.escapeHtml(r.category)}</div>
        <div>${IRWR.escapeHtml(r.id)}</div>
      </div>
    `).join('');
  }

  input.addEventListener('input', () => render(input.value));
  render('');
});
