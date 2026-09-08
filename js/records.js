document.addEventListener('DOMContentLoaded', () => {
  const filterRow = document.getElementById('filterRow');
  const grid = document.getElementById('recordsGrid');

  IRWR.CATEGORIES.forEach((c) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = c.slug;
    btn.textContent = c.label;
    filterRow.appendChild(btn);
  });

  function render(category) {
    const records = IRWR.filterRecords(IRWR_RECORDS, { category: category || undefined });
    grid.innerHTML = records.map((r) => `
      <article class="rcard reveal in" data-id="${IRWR.escapeHtml(r.id)}">
        <div class="rph"><img class="photo" src="${IRWR.photoUrl(r, '', 700, 500)}" alt="${IRWR.escapeHtml(r.title)}" loading="lazy" width="700" height="500"></div>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.category)}</span><span>${IRWR.escapeHtml(r.country || 'International')}</span><span>${IRWR.escapeHtml(r.status)}</span></div>
        <h3>${IRWR.escapeHtml(r.title)}</h3>
        <p>${IRWR.escapeHtml(r.description)}</p>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.id)}</span><a href="holders.html?holder=${encodeURIComponent(r.holderName)}" class="btn-line">Holder profile</a></div>
      </article>
    `).join('');
    IRWR.initTilt('.rcard');
  }

  grid.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let the "Holder profile" link navigate normally
    const card = e.target.closest('.rcard');
    if (!card) return;
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
