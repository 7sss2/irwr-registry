document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');

  function render(query) {
    if (!query.trim()) { results.innerHTML = '<div class="search-empty">Start typing to search the registry.</div>'; return; }
    const matches = IRWR.searchRecords(IRWR_RECORDS, query);
    if (!matches.length) { results.innerHTML = `<div class="search-empty">No records match "${query}".</div>`; return; }
    results.innerHTML = matches.map((r) => `
      <div class="search-row">
        <img class="photo" src="https://picsum.photos/seed/${r.photoSeed}/120/120" alt="">
        <div><strong>${r.title}</strong><div>${r.holderName} · ${r.country}</div></div>
        <div>${r.category}</div>
        <div>${r.id}</div>
      </div>
    `).join('');
  }

  input.addEventListener('input', () => render(input.value));
  render('');
});
