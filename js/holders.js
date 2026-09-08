document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('holdersGrid');
  const byHolder = IRWR.groupBy('holderName');

  grid.innerHTML = Object.keys(byHolder).sort().map((name) => {
    const records = byHolder[name];
    const r = records[0];
    return `
      <div class="hcard reveal in tilt" data-holder="${IRWR.escapeHtml(name)}">
        <div class="hface">
          <div class="hph"><img class="photo" src="${IRWR.photoUrl(r, '-holder', 500, 700)}" alt="${IRWR.escapeHtml(name)}" loading="lazy" width="500" height="700"></div>
          <div class="hname">${IRWR.escapeHtml(name)}</div>
          <div class="hmeta">${IRWR.escapeHtml(r.country || 'International')} · ${IRWR.escapeHtml(r.category)} · ${IRWR.escapeHtml(r.id)}</div>
        </div>
        <div class="hface hback">
          <div>
            <div class="hname">${IRWR.escapeHtml(r.title)}</div>
            <div class="hmeta">${records.length} record${records.length > 1 ? 's' : ''} on file</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
  IRWR.initTilt('.hcard');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.hcard');
    if (!card) return;
    IRWR.openHolderModal(card.dataset.holder);
  });

  // a "Holder profile" link from records.html arrives as holders.html?holder=NAME —
  // open that holder's detail straight away instead of landing on the plain grid.
  const requestedHolder = new URLSearchParams(location.search).get('holder');
  if (requestedHolder && byHolder[requestedHolder]) IRWR.openHolderModal(requestedHolder);
});
