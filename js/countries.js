// small flag lookup for the top-10 board — falls back to a globe glyph for
// any country name not in the map, so a future dataset shift can't break render
const FLAG_EMOJI = {
  USA: '🇺🇸', China: '🇨🇳', Kazakhstan: '🇰🇿', 'United Kingdom': '🇬🇧',
  Germany: '🇩🇪', Japan: '🇯🇵', France: '🇫🇷', Russia: '🇷🇺', India: '🇮🇳',
  Portugal: '🇵🇹', Canada: '🇨🇦', Australia: '🇦🇺', Brazil: '🇧🇷', Italy: '🇮🇹',
  Spain: '🇪🇸', 'South Korea': '🇰🇷', Netherlands: '🇳🇱', Sweden: '🇸🇪',
  Switzerland: '🇨🇭', Norway: '🇳🇴', Mexico: '🇲🇽', 'Saudi Arabia': '🇸🇦',
  UAE: '🇦🇪', Turkey: '🇹🇷', Indonesia: '🇮🇩', Singapore: '🇸🇬',
};
function flagFor(country) { return FLAG_EMOJI[country] || '🌐'; }

document.addEventListener('DOMContentLoaded', () => {
  const byCountry = IRWR.groupBy('country');
  const top10 = Object.entries(byCountry).sort((a, b) => b[1].length - a[1].length).slice(0, 10);
  const max = Math.max(...top10.map(([, records]) => records.length));
  const list = document.getElementById('countryList');

  const podiumOrder = [1, 0, 2]; // silver, gold, bronze visual order
  const podium = podiumOrder
    .map((i) => top10[i])
    .filter(Boolean)
    .map(([country, records], visualIndex) => {
      const rank = podiumOrder[visualIndex] + 1;
      const pct = Math.round((records.length / max) * 100);
      return `
        <div class="country-row podium rank-${rank}" data-country="${IRWR.escapeHtml(country)}">
          <div class="podium-medal">${rank}</div>
          <div class="podium-flag">${flagFor(country)}</div>
          <h3 class="podium-name">${IRWR.escapeHtml(country)}</h3>
          <div class="podium-count num" data-count="${records.length}">0</div>
          <div class="podium-label">records</div>
          <div class="country-bar-track"><div class="country-bar" data-pct="${pct}"></div></div>
        </div>
      `;
    }).join('');

  const board = top10
    .slice(3)
    .map(([country, records], i) => {
      const rank = i + 4;
      const pct = Math.round((records.length / max) * 100);
      return `
        <div class="country-row board" data-country="${IRWR.escapeHtml(country)}">
          <div class="board-rank">${rank}</div>
          <div class="board-flag">${flagFor(country)}</div>
          <div class="board-info">
            <div class="board-top">
              <span class="board-name">${IRWR.escapeHtml(country)}</span>
              <span class="board-count num" data-count="${records.length}">0</span>
            </div>
            <div class="country-bar-track"><div class="country-bar" data-pct="${pct}"></div></div>
          </div>
        </div>
      `;
    }).join('');

  list.innerHTML = `
    <div class="country-podium">${podium}</div>
    <div class="country-board">${board}</div>
  `;

  const barObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.width = entry.target.dataset.pct + '%';
      barObs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.country-bar').forEach((el) => barObs.observe(el));

  IRWR.initCounters('.country-row .num[data-count]');
  IRWR.initTilt('.country-row.podium, .country-row.board');
});

// exposed for globe3d.js (Task 18) to highlight the matching row on marker hover/click
IRWR.highlightCountryRow = function (country) {
  document.querySelectorAll('.country-row').forEach((row) => {
    row.classList.toggle('highlight', row.dataset.country === country);
  });
};
