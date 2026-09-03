document.addEventListener('DOMContentLoaded', () => {
  const statRecords = document.getElementById('statRecords');
  const statCountries = document.getElementById('statCountries');
  const statCategories = document.getElementById('statCategories');
  if (!statRecords || !statCountries || !statCategories) return;

  statRecords.dataset.count = IRWR_RECORDS.length;
  statCountries.dataset.count = new Set(IRWR_RECORDS.map((r) => r.country)).size;
  statCategories.dataset.count = IRWR.CATEGORIES.length;

  IRWR.initCounters('.statrow .num');
});
