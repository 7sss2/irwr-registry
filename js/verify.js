document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verifyForm');
  const input = document.getElementById('verifyInput');
  const result = document.getElementById('verifyResult');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = input.value.trim().toUpperCase();
    const record = IRWR.byId(id);
    if (!record) {
      result.innerHTML = `<div class="cert-not-found">No record found for "${id}". Check the IRWR index number and try again.</div>`;
      return;
    }
    result.innerHTML = `
      <div class="cert-card reveal in">
        <div class="cert-status">${record.status === 'verified' ? 'Verified record' : 'Pending review'}</div>
        <h2>${record.title}</h2>
        <p>${record.holderName} · ${record.country}</p>
        <p>${record.category} · ${record.date}</p>
        <p class="cert-provenance">Originally recognized by GBR (Global Best of Records). Registered in IRWR under ID <strong>${record.id}</strong>.</p>
      </div>
    `;
  });
});
