document.addEventListener('DOMContentLoaded', () => {
  const byCountry = IRWR.groupBy('country');
  const max = Math.max(...Object.values(byCountry).map((r) => r.length));
  const list = document.getElementById('countryList');

  const rows = Object.entries(byCountry)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([country, records]) => {
      const pct = Math.round((records.length / max) * 100);
      return `
        <div class="country-row" data-country="${country}">
          <div>${country}</div>
          <div class="country-bar-track"><div class="country-bar" data-pct="${pct}"></div></div>
          <div class="country-count">${records.length}</div>
        </div>
      `;
    }).join('');
  list.innerHTML = rows;

  const barObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.pct + '%';
      barObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.country-bar').forEach((el) => barObs.observe(el));
});

// exposed for globe3d.js (Task 18) to highlight the matching row on marker hover/click
IRWR.highlightCountryRow = function (country) {
  document.querySelectorAll('.country-row').forEach((row) => {
    row.classList.toggle('highlight', row.dataset.country === country);
  });
};
