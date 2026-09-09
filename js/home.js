document.addEventListener('DOMContentLoaded', () => {
  // keep the stat row honest — it's easy for a hand-typed number here to
  // drift from the real dataset after a dedup/scale change (it did: this
  // used to hardcode 303 records after 8 were retired as duplicates).
  const statRecords = document.getElementById('statHomeRecords');
  const statCountries = document.getElementById('statHomeCountries');
  const statCategories = document.getElementById('statHomeCategories');
  if (statRecords) statRecords.dataset.count = IRWR_RECORDS.length;
  if (statCountries) statCountries.dataset.count = new Set(IRWR_RECORDS.map((r) => r.country).filter(Boolean)).size;
  if (statCategories) statCategories.dataset.count = IRWR.CATEGORIES.length;

  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  const featured = IRWR_RECORDS.filter((r) => r.featured);
  grid.innerHTML = featured.map((r, i) => `
    <div class="ccard reveal in" data-id="${IRWR.escapeHtml(r.id)}">
      <div class="cph"><img class="photo" src="${IRWR.photoUrl(r, '', 700, 700)}" alt="${IRWR.escapeHtml(r.title)}" loading="${i < 3 ? 'eager' : 'lazy'}" width="700" height="700"></div>
      <div class="ctags"><span class="ctag">${IRWR.escapeHtml(r.category)}</span><span class="ctag">Verified</span></div>
      <div class="cbottom">
        <h3>${IRWR.escapeHtml(r.title)}</h3>
        <p>${IRWR.escapeHtml(r.description)}</p>
        <div class="crow"><a href="holders.html?holder=${encodeURIComponent(r.holderName)}" class="btn-line">Holder profile</a><button type="button" class="btn-gold" data-ripple data-view-entry>View entry</button></div>
      </div>
    </div>
  `).join('');

  grid.addEventListener('click', (e) => {
    if (e.target.closest('a')) return; // let the "Holder profile" link navigate normally
    const card = e.target.closest('.ccard');
    if (!card) return;
    const record = IRWR.byId(card.dataset.id);
    if (record) IRWR.openRecordModal(record);
  });
});
