import { showConfirmToast } from '../components/toast.js';

const API_BASE = 'https://emailcrm-clients.raphaellevinders.workers.dev'; // 🔴 CHANGE THIS

export function createSendPanel({ campaign, onClose } = {}) {
  const { campaign_id, name, subject, body_json } = campaign;

  /* ----------------------------
     State
  ---------------------------- */
  const selectedRecipients = new Set();
  let allContacts = [];
  let filteredContacts = [];

  /* ----------------------------
     Overlay + Panel
  ---------------------------- */
  const overlay = document.createElement('div');
  overlay.className = 'send-panel-overlay';

  const panel = document.createElement('div');
  panel.className = 'send-panel';

  panel.innerHTML = `
    <div class="send-panel-header">
      <h3>Send Campaign</h3>
      <button class="close-btn">×</button>
    </div>

    <div class="send-panel-body">

      <label class="radio">
        <input type="radio" name="recipient_mode" value="all" checked />
        <span>All contacts</span>
      </label>

      <label class="radio">
        <input type="radio" name="recipient_mode" value="filtered" />
        <span>Filtered contacts</span>
      </label>

      <label class="radio">
        <input type="radio" name="recipient_mode" value="manual" />
        <span>Select manually</span>
      </label>

      <div class="filter-section hidden">
        <div class="filter-row">
          <select class="filter-field">
            <option value="">Select field</option>
          </select>

          <select class="filter-operator">
            <option value="equals">equals</option>
            <option value="contains">contains</option>
          </select>

          <input class="filter-value" placeholder="Value" />
        </div>
      </div>

      <div class="manual-section hidden">
        <div class="manual-sticky">
          <input
            type="text"
            class="manual-search"
            placeholder="Search name or email…"
          />
          <small class="selected-count">0 selected</small>
        </div>

        <div class="contact-list"></div>
      </div>

    </div>

    <div class="send-panel-footer">
      <button class="btn btn-secondary cancel-btn">Cancel</button>
      <button class="btn btn-danger send-btn">Send Campaign</button>
    </div>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  /* ----------------------------
     DOM refs
  ---------------------------- */
  const filterSection = panel.querySelector('.filter-section');
  const manualSection = panel.querySelector('.manual-section');
  const contactList = panel.querySelector('.contact-list');
  const selectedCount = panel.querySelector('.selected-count');
  const searchInput = panel.querySelector('.manual-search');
  const sendBtn = panel.querySelector('.send-btn');

  /* ----------------------------
     Send handler
  ---------------------------- */
  sendBtn.onclick = () => {
    const mode =
      panel.querySelector('input[name="recipient_mode"]:checked')?.value;

    if (mode === 'manual' && selectedRecipients.size === 0) {
      showToast('Select at least one recipient', 'danger');
      return;
    }

    showConfirmToast({
      message: `
        <strong>Send this campaign?</strong><br/>
        This action cannot be undone.
      `,
      confirmText: 'Send now',
      cancelText: 'Cancel',
      onConfirm: () => sendCampaign(mode)
    });
  };

  function sendCampaign(mode) {
    sendBtn.disabled = true;
    sendBtn.innerText = 'Sending…';

    const payload = {
      mode,
      selectedEmails: Array.from(selectedRecipients),
      filter:
        mode === 'filtered'
          ? {
              field: panel.querySelector('.filter-field')?.value,
              operator: panel.querySelector('.filter-operator')?.value,
              value: panel.querySelector('.filter-value')?.value
            }
          : null,
      campaign: {
        campaign_id,
        name,
        subject,
        body_json
      }
    };

    fetch(`${API_BASE}/campaigns/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(res => {
        showToast(
          `Sent: ${res.sent}, Failed: ${res.failed}`,
          res.failed ? 'warning' : 'success'
        );
        close();
      })
      .catch(err => {
        console.error(err);
        showToast(err.message || 'Send failed', 'danger');
        sendBtn.disabled = false;
        sendBtn.innerText = 'Send Campaign';
      });
  }

  /* ----------------------------
     Load filter attributes
  ---------------------------- */
  fetch(`${API_BASE}/contacts/attributes`)
    .then(r => r.json())
    .then(res => {
      const fields = res?.attributes || [];
      const fieldSelect = panel.querySelector('.filter-field');

      fields.forEach(attr => {
        const opt = document.createElement('option');
        opt.value = attr;
        opt.innerText = attr;
        fieldSelect.appendChild(opt);
      });
    });

  /* ----------------------------
     Manual search
  ---------------------------- */
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();

    filteredContacts = allContacts.filter(c => {
      const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
      const email = (c.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });

    renderContactList(filteredContacts);
  });

  /* ----------------------------
     Render contacts
  ---------------------------- */
  function renderContactList(contacts) {
    contactList.innerHTML = '';

    if (!contacts.length) {
      contactList.innerHTML = '<p>No contacts found.</p>';
      return;
    }

    contacts.forEach(contact => {
      const row = document.createElement('label');
      row.className = 'contact-row';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedRecipients.has(contact.email);

      checkbox.onchange = () => {
        checkbox.checked
          ? selectedRecipients.add(contact.email)
          : selectedRecipients.delete(contact.email);
        updateSelectedCount();
      };

      const info = document.createElement('div');
      info.innerHTML = `
        <strong>${contact.first_name || ''} ${contact.last_name || ''}</strong><br/>
        <small>${contact.email}</small>
      `;

      row.appendChild(checkbox);
      row.appendChild(info);
      contactList.appendChild(row);
    });

    updateSelectedCount();
  }

  function updateSelectedCount() {
    selectedCount.innerText = `${selectedRecipients.size} selected`;
  }

  /* ----------------------------
     Mode switching
  ---------------------------- */
  panel.querySelectorAll('input[name="recipient_mode"]').forEach(radio => {
    radio.onchange = e => {
      const mode = e.target.value;

      selectedRecipients.clear();
      updateSelectedCount();
      contactList.innerHTML = '';

      filterSection.classList.toggle('hidden', mode !== 'filtered');
      manualSection.classList.toggle('hidden', mode !== 'manual');

      if (mode === 'manual' && !allContacts.length) {
        contactList.innerHTML = '<p>Loading contacts…</p>';

        fetch(`${API_BASE}/contacts/list`)
          .then(r => r.json())
          .then(contacts => {
            allContacts = contacts || [];
            filteredContacts = allContacts;
            renderContactList(filteredContacts);
          })
          .catch(() => {
            contactList.innerHTML =
              '<p style="color:red;">Failed to load contacts</p>';
          });
      }
    };
  });

  /* ----------------------------
     Close
  ---------------------------- */
  panel.querySelector('.close-btn').onclick = close;
  panel.querySelector('.cancel-btn').onclick = close;

  overlay.onclick = e => {
    if (e.target === overlay) close();
  };

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 200);
    if (typeof onClose === 'function') onClose();
  }

  requestAnimationFrame(() => overlay.classList.add('open'));
}
