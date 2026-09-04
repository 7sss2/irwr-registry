document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('holdersGrid');
  const byHolder = IRWR.groupBy('holderName');

  grid.innerHTML = Object.keys(byHolder).sort().map((name) => {
    const records = byHolder[name];
    const r = records[0];
    return `
      <div class="hcard reveal in tilt">
        <div class="hface">
          <div class="hph"><img class="photo" src="https://picsum.photos/seed/${encodeURIComponent(r.photoSeed)}-holder/500/700" alt=""></div>
          <div class="hname">${IRWR.escapeHtml(name)}</div>
          <div class="hmeta">${IRWR.escapeHtml(r.country)} · ${IRWR.escapeHtml(r.category)} · ${IRWR.escapeHtml(r.id)}</div>
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
});
