export function renderCampaigns(navigateToComposer) {
  const wrapper = document.createElement('div');
  wrapper.className = 'panel';

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

  const list = document.createElement('div');
  list.style.marginTop = '16px';
  wrapper.appendChild(list);

  google.script.run
    .withSuccessHandler(campaigns => {
      if (!campaigns.length) {
        list.innerHTML = '<p>No campaigns yet.</p>';
        return;
      }

      campaigns.forEach(c => {
        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '12px';
        row.style.border = '1px solid #E5E7EB';
        row.style.borderRadius = '10px';
        row.style.marginBottom = '8px';

        const info = document.createElement('div');
        info.innerHTML = `
          <strong>${c.name || 'Untitled Campaign'}</strong><br>
          <span style="color:#64748B;font-size:12px;">
            ${c.subject || '(no subject)'} • ${c.status || 'draft'}
          </span>
        `;

        const openBtn = document.createElement('button');
        openBtn.className = 'btn btn-secondary';
        openBtn.innerText = 'Open';
        openBtn.onclick = () => navigateToComposer(c.campaign_id);

        row.appendChild(info);
        row.appendChild(openBtn);
        list.appendChild(row);
      });
    })
    .withFailureHandler(err => {
      list.innerHTML = `<p style="color:red;">${err.message}</p>`;
    })
    .listCampaigns();

  return wrapper;
}
