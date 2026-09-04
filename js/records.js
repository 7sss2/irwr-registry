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
      <article class="rcard reveal in">
        <div class="rph"><img class="photo" src="${IRWR.photoUrl(r, '', 700, 500)}" alt=""></div>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.category)}</span><span>${IRWR.escapeHtml(r.country)}</span><span>${IRWR.escapeHtml(r.status)}</span></div>
        <h3>${IRWR.escapeHtml(r.title)}</h3>
        <p>${IRWR.escapeHtml(r.description)}</p>
        <div class="rmeta"><span>${IRWR.escapeHtml(r.id)}</span><a href="holders.html?holder=${encodeURIComponent(r.holderName)}" class="btn-line">Holder profile</a></div>
      </article>
    `).join('');
    IRWR.initTilt('.rcard');
  }

  filterRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.chip');
    if (!btn) return;
    filterRow.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
    render(btn.dataset.category);
  });

  render('');
});
