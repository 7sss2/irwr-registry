document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;
  const featured = IRWR_RECORDS.filter((r) => r.featured);
  grid.innerHTML = featured.map((r) => `
    <div class="ccard reveal in">
      <div class="cph"><img class="photo" src="https://picsum.photos/seed/${r.photoSeed}/700/700" alt=""></div>
      <div class="ctags"><span class="ctag">${r.category}</span><span class="ctag">${r.status === 'verified' ? 'Verified' : 'Coming soon'}</span></div>
      <div class="cbottom">
        <h3>${r.title}</h3>
        <p>${r.description}</p>
        <div class="crow"><a href="holders.html" class="btn-line">Holder profile</a><a href="records.html" class="btn-gold" data-ripple>View entry</a></div>
      </div>
    </div>
  `).join('');
});
