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
    .withSuccessHandler(res => {
      const campaigns = Array.isArray(res) ? res : [];

      console.log('FRONTEND RECEIVED CAMPAIGNS:', campaigns);

      list.innerHTML = '';

      if (!campaigns.length) {
        list.innerHTML = '<p>No campaigns found.</p>';
        return;
      }

      campaigns.forEach(c => {
        const row = document.createElement('div');
        row.className = 'campaign-row';
        row.style.cursor = 'pointer';
        row.style.padding = '12px';
        row.style.borderBottom = '1px solid #E5E7EB';

        row.innerHTML = `
          <strong>${c.name}</strong><br/>
          <small>${c.subject || ''}</small>
        `;

        row.onclick = () => {
          navigateToComposer(c.campaign_id);
        };

        list.appendChild(row);
      });
    })
    .withFailureHandler(err => {
      console.error('listCampaigns failed:', err);
      list.innerHTML = `<p style="color:red;">${err.message}</p>`;
    })
    .listCampaigns();

  return wrapper;
}
