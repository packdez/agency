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
window.AS.listCampaigns(
  res => {
    console.log('RAW RESPONSE:', res);
    // render campaigns
  },
  err => {
    console.error(err);
  }
);


  return wrapper;
}
