document.addEventListener('DOMContentLoaded', () => {
  const filterRow = document.getElementById('filterRow');
  const grid = document.getElementById('recordsGrid');
  const sortSelect = document.getElementById('sortSelect');
  const resultsCount = document.getElementById('resultsCount');

  IRWR.CATEGORIES.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = c.slug;
    btn.textContent = c.label;
    filterRow.appendChild(btn);
  });

  function sortRecords(records, mode) {
    const sorted = records.slice();
    switch (mode) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'newest':
        return sorted.sort((a, b) => (parseInt(b.date, 10) || 0) - (parseInt(a.date, 10) || 0));
      case 'oldest':
        return sorted.sort((a, b) => (parseInt(a.date, 10) || 9999) - (parseInt(b.date, 10) || 9999));
      case 'country':
        return sorted.sort((a, b) => (a.country || 'zzz').localeCompare(b.country || 'zzz'));
      default:
        return sorted; // already in registry (IRWR ID) order
    }
  }

  function render(category) {
    const records = sortRecords(IRWR.filterRecords(IRWR_RECORDS, { category: category || undefined }), sortSelect.value);
    resultsCount.textContent = `${records.length} record${records.length === 1 ? '' : 's'}`;
    grid.innerHTML = records.map((r) => `
      <article class="rcard reveal in" data-id="${IRWR.escapeHtml(r.id)}" tabindex="0" role="button" aria-label="View details for ${IRWR.escapeHtml(r.title)}">
        <div class="rph"><img class="photo" src="${IRWR.photoUrl(r, '', 700, 500)}" alt="${IRWR.escapeHtml(r.title)}" loading="lazy" width="700" height="500"></div>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.category)}</span><span>${IRWR.escapeHtml(r.country || 'International')}</span><span>${IRWR.escapeHtml(r.status)}</span></div>
        <h2>${IRWR.escapeHtml(r.title)}</h2>
        <p>${IRWR.escapeHtml(r.description)}</p>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.id)}</span><a href="holders.html?holder=${encodeURIComponent(r.holderName)}" class="btn-line">Holder profile</a></div>
      </article>
    `).join('');
    IRWR.initTilt('.rcard');
  }

  function activeCategory() {
    return filterRow.querySelector('.chip.active')?.dataset.category || '';
  }

  grid.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let the "Holder profile" link navigate normally
    const card = e.target.closest('.rcard');
    if (!card) return;
    const record = IRWR.byId(card.dataset.id);
    if (record) IRWR.openRecordModal(record);
  });

  // the card itself is tabindex="0"/role="button" (see render()) so keyboard
  // users can reach and open it the same way a mouse click does - the nested
  // "Holder profile" <a> already gets native Enter-activation, so it's
  // excluded here the same way it's excluded from the click handler above.
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target.closest('a')) return;
    const card = e.target.closest('.rcard');
    if (!card) return;
    e.preventDefault(); // stop Space from scrolling the page
    const record = IRWR.byId(card.dataset.id);
    if (record) IRWR.openRecordModal(record);
  });

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    filterRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.category);
  });

  sortSelect.addEventListener('change', () => render(activeCategory()));

  // a category tile (categories.html) links here as records.html?category=slug —
  // pre-select the matching chip so the grid opens already filtered instead of
  // showing every category's records mixed together.
  const requestedCategory = new URLSearchParams(location.search).get('category');
  const initialChip = requestedCategory && filterRow.querySelector(`.chip[data-category="${requestedCategory}"]`);
  if (initialChip) {
    filterRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    initialChip.classList.add('active');
    render(requestedCategory);
  } else {
    render('');
  }
});
