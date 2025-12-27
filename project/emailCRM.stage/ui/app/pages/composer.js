import { apiFetch } from '../app.js';
import { showToast } from '../../components/toast.js';

let currentCampaignId = null;

export function renderComposer(campaignId = null) {
  currentCampaignId = campaignId;

  const wrap = document.createElement('div');
  wrap.className = 'panel';

  wrap.innerHTML = `
    <h2>Composer</h2>

    <label>Campaign name</label>
    <input class="campaign-name" />

    <label>Subject</label>
    <input class="campaign-subject" />

    <label>Body (temporary plain text)</label>
    <textarea class="campaign-body" rows="10"></textarea>

    <div style="margin-top:16px;">
      <button class="btn btn-primary save-btn">Save</button>
    </div>
  `;

  const nameInput = wrap.querySelector('.campaign-name');
  const subjectInput = wrap.querySelector('.campaign-subject');
  const bodyInput = wrap.querySelector('.campaign-body');

  // ✅ Load campaign AFTER DOM exists
  if (campaignId) {
    apiFetch('/campaigns/get', { campaign_id: campaignId })
      .then(res => {
        nameInput.value = res.name || '';
        subjectInput.value = res.subject || '';
        bodyInput.value = JSON.stringify(res.body_json || {}, null, 2);
      })
      .catch(() => {
        showToast('Failed to load campaign', 'danger');
      });
  }

  wrap.querySelector('.save-btn').onclick = () => {
    showToast('Save comes next');
  };

  return wrap;
}
