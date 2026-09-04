document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verifyForm');
  const input = document.getElementById('verifyInput');
  const result = document.getElementById('verifyResult');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = input.value.trim().toUpperCase();
    const record = IRWR.byId(id);
    if (!record) {
      result.innerHTML = `<div class="cert-not-found">No record found for "${IRWR.escapeHtml(id)}". Check the IRWR index number and try again.</div>`;
      return;
    }
    result.innerHTML = `
      <div class="cert-card reveal in">
        <div class="cert-status">Verified record</div>
        <h2>${IRWR.escapeHtml(record.title)}</h2>
        <p>${IRWR.escapeHtml(record.holderName)} · ${IRWR.escapeHtml(record.country)}</p>
        <p>${IRWR.escapeHtml(record.category)} · ${IRWR.escapeHtml(record.date)}</p>
        <p class="cert-provenance">Originally recognized by GBR (Global Best of Records). Registered in IRWR under ID <strong>${IRWR.escapeHtml(record.id)}</strong>.</p>
      </div>
    `;
  });
});
