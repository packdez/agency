import { apiFetch } from '../app.js';
import { showToast } from '../../components/toast.js';

let currentCampaign = null;

export function renderComposer() {
  const wrap = document.createElement('div');
  wrap.className = 'panel';

  wrap.innerHTML = `
    <h2>Composer</h2>

    <label>
      Campaign name
      <input class="campaign-name" placeholder="Campaign name" />
    </label>

    <label style="margin-top:12px;display:block;">
      Subject
      <input class="campaign-subject" placeholder="Email subject" />
    </label>

    <label style="margin-top:12px;display:block;">
      Body (temporary plain text)
      <textarea
        class="campaign-body"
        placeholder="Email body"
        style="min-height:200px;"
      ></textarea>
    </label>

    <div style="margin-top:16px;">
      <button class="btn btn-primary save-btn">Save</button>
    </div>
  `;

  wrap.querySelector('.save-btn').onclick = saveCampaign;

  return wrap;
}

/* =========================
   LOAD EXISTING CAMPAIGN
========================= */
export function loadCampaign(campaignId) {
  apiFetch('/campaigns/get', { campaign_id: campaignId })
    .then(campaign => {
      currentCampaign = campaign;

      document.querySelector('.campaign-name').value =
        campaign.name || '';

      document.querySelector('.campaign-subject').value =
        campaign.subject || '';

      document.querySelector('.campaign-body').value =
        JSON.stringify(campaign.body_json || {}, null, 2);
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to load campaign', 'danger');
    });
}

/* =========================
   SAVE (NEW OR EXISTING)
========================= */
function saveCampaign() {
  const name =
    document.querySelector('.campaign-name').value.trim();

  const subject =
    document.querySelector('.campaign-subject').value.trim();

  const bodyText =
    document.querySelector('.campaign-body').value;

  let body_json;

  try {
    body_json = bodyText ? JSON.parse(bodyText) : {};
  } catch {
    showToast('Body must be valid JSON (temporary)', 'danger');
    return;
  }

  const payload = {
    campaign_id: currentCampaign?.campaign_id,
    name,
    subject,
    body_json
  };

  apiFetch('/campaigns/save', payload)
    .then(res => {
      currentCampaign = {
        ...currentCampaign,
        ...payload,
        campaign_id: res.campaign_id
      };

      showToast('Campaign saved', 'success');
    })
    .catch(err => {
      console.error(err);
      showToast('Failed to save campaign', 'danger');
    });
}
