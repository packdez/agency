export function renderCampaigns(navigateToComposer) {
  const wrapper = document.createElement('div');
  wrapper.className = 'panel';

  // Header
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';

  const title = document.createElement('h2');
  title.innerText = 'Campaigns';

  const newBtn = document.createElement('button');
  newBtn.className = 'btn btn-primary';
  newBtn.innerText = 'New Campaign';
  newBtn.onclick = () => navigateToComposer();

  header.appendChild(title);
  header.appendChild(newBtn);
  wrapper.appendChild(header);

  // List container
  const list = document.createElement('div');
  list.style.marginTop = '16px';
  list.innerHTML = '<p>Loading campaigns…</p>';
  wrapper.appendChild(list);

  // ✅ Load campaigns from backend
google.script.run
  .withSuccessHandler(campaigns => {
    console.log('FRONTEND RECEIVED CAMPAIGNS:', campaigns);

    list.innerHTML = '';

    if (!Array.isArray(campaigns) || !campaigns.length) {
      list.innerHTML = '<p>No campaigns found.</p>';
      return;
    }

    campaigns.forEach(c => {
      const row = document.createElement('div');
      row.className = 'campaign-row';
      row.innerHTML = `
        <strong>${c.name}</strong><br/>
        <small>${c.subject || ''}</small>
      `;
      row.onclick = () => navigateToComposer(c.campaign_id);
      list.appendChild(row);
    });
  })
  .listCampaigns();



  return wrapper;
}
