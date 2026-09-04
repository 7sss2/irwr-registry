document.addEventListener('DOMContentLoaded', () => {
  const categoryFilter = document.getElementById('categoryFilter');
  const countryFilter = document.getElementById('countryFilter');
  const body = document.getElementById('archiveBody');
  const pagination = document.getElementById('pagination');
  const PAGE_SIZE = 10;
  let currentPage = 1;

  IRWR.CATEGORIES.forEach((c) => categoryFilter.add(new Option(c.label, c.slug)));
  [...new Set(IRWR_RECORDS.map((r) => r.country))].filter(Boolean).sort().forEach((c) => countryFilter.add(new Option(c, c)));

  function render() {
    const filtered = IRWR.filterRecords(IRWR_RECORDS, {
      category: categoryFilter.value || undefined,
      country: countryFilter.value || undefined,
    });
    const { items, page, totalPages } = IRWR.paginate(filtered, currentPage, PAGE_SIZE);
    currentPage = page;

    body.innerHTML = items.map((r) => `
      <tr><td>${r.id}</td><td>${r.title}</td><td>${r.holderName}</td><td>${r.country}</td><td>${r.category}</td><td>${r.date}</td><td>${r.status}</td></tr>
    `).join('') || '<tr><td colspan="7">No records match these filters.</td></tr>';

    let pageButtons = `<button ${page === 1 ? 'disabled' : ''} data-page="${page - 1}">Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      pageButtons += `<button class="${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    pageButtons += `<button ${page === totalPages ? 'disabled' : ''} data-page="${page + 1}">Next</button>`;
    pagination.innerHTML = pageButtons;
  }

  [categoryFilter, countryFilter].forEach((el) => el.addEventListener('change', () => { currentPage = 1; render(); }));
  pagination.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-page]');
    if (!btn) return;
    currentPage = parseInt(btn.dataset.page, 10);
    render();
  });

  render();
});
