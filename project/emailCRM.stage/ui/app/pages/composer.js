import { API_BASE } from '../app.js';
import { showToast } from '../../components/toast.js';

let currentCampaign = null;

export function renderComposer() {
  const wrap = document.createElement('div');
  wrap.className = 'panel';

  wrap.innerHTML = `
    <h2>Composer</h2>
    <input class="campaign-name" placeholder="Campaign name" />
    <textarea class="campaign-body" placeholder="Email body"></textarea>
    <button class="btn btn-primary save-btn">Save</button>
  `;

  wrap.querySelector('.save-btn').onclick = () => {
    showToast('Save not wired yet (next step)');
  };

  return wrap;
}

export function loadCampaign(id) {
  fetch(`${API_BASE}/campaigns/get`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CLIENT-ID': window.CLIENT_ID,
      'X-CLIENT-KEY': window.CLIENT_KEY
    },
    body: JSON.stringify({ campaign_id: id })
  })
    .then(r => r.json())
    .then(res => {
      currentCampaign = res;
      document.querySelector('.campaign-name').value = res.name || '';
      document.querySelector('.campaign-body').value = res.subject || '';
    });
}
