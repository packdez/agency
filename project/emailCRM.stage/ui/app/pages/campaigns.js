const API_BASE = 'https://emailcrm-clients.raphaellevinders.workers.dev/'; // 🔴 CHANGE THIS

export function renderCampaigns(navigateToComposer) {
  const wrapper = document.createElement('div');
  wrapper.className = 'panel';

  /* ---------------- Header ---------------- */
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

  /* ---------------- List ---------------- */
  const list = document.createElement('div');
  list.style.marginTop = '16px';
  list.innerHTML = '<p>Loading campaigns…</p>';
  wrapper.appendChild(list);

  /* ---------------- Fetch from Worker ---------------- */
  fetch(`${API_BASE}/campaigns/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',

      // 🔐 example auth (adapt if needed)
      'X-CLIENT-ID': window.CLIENT_ID,
      'X-CLIENT-KEY': window.CLIENT_KEY
    },
    body: JSON.stringify({})
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    })
    .then(campaigns => {
      console.log('Campaigns:', campaigns);
      list.innerHTML = '';

      if (!Array.isArray(campaigns) || !campaigns.length) {
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
          <strong>${c.name || 'Untitled Campaign'}</strong><br/>
          <small>${c.subject || ''}</small>
        `;

        row.onclick = () => navigateToComposer(c.campaign_id);
        list.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Failed to load campaigns:', err);
      list.innerHTML =
        '<p style="color:red;">Failed to load campaigns</p>';
    });

  return wrapper;
}
