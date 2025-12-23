import { showConfirmToast } from '../ui/components/toast.js'; // adjust path


export function createSendPanel({ campaign, onClose } = {}) {
  const { campaign_id, name, subject, body_json } = campaign;


  /* ----------------------------
   State (in-memory)
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

      <!-- MODE SELECTION -->
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


  
      <!-- FILTER SECTION -->
      <div class="filter-section hidden">
        <div class="filter-row">
          <select class="filter-field">
            <option value="">Select field</option>
          </select>

          <select class="filter-operator">
            <option value="equals">equals</option>
            <option value="contains">contains</option>
          </select>

          <input
            class="filter-value"
            placeholder="Value"
            type="text"
          />
        </div>
      </div>

      <!-- MANUAL SELECTION -->
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
  const searchInput = panel.querySelector('.manual-search');const sendBtn = panel.querySelector('.send-btn');

sendBtn.onclick = () => {
  const mode =
    panel.querySelector('input[name="recipient_mode"]:checked')?.value;

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

if (mode === 'manual' && selectedRecipients.size === 0) {
  showToast('Select at least one recipient', 'danger');
  return;
}


sendBtn.onclick = () => {
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
    onConfirm: () => {
      actuallySendCampaign();
    }
  });
};


function actuallySendCampaign() {
  sendBtn.disabled = true;
  sendBtn.innerText = 'Sending…';

  google.script.run
    .withSuccessHandler(res => {
      showToast(
        `Sent: ${res.sent}, Failed: ${res.failed}`,
        res.failed ? 'warning' : 'success'
      );
      close();
    })
    .withFailureHandler(err => {
      console.error(err);
      showToast(err.message || 'Send failed', 'danger');
      sendBtn.disabled = false;
      sendBtn.innerText = 'Send Campaign';
    })
    .sendCampaignFromUI(payload);
}
 

  /* ----------------------------
     Load contact attributes (filters)
  ---------------------------- */
  google.script.run
    .withSuccessHandler(res => {
      const fields = res?.attributes || [];
      const fieldSelect = panel.querySelector('.filter-field');

      fields.forEach(attr => {
        const opt = document.createElement('option');
        opt.value = attr;
        opt.innerText = attr;
        fieldSelect.appendChild(opt);
      });
    })
    .getContactAttributes();


  searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();

  if (manualSection.classList.contains('hidden')) return;

  filteredContacts = allContacts.filter(c => {
    const name = `${c.first_name || ''} ${c.last_name || ''}`.toLowerCase();
    const email = (c.email || '').toLowerCase();

    return name.includes(q) || email.includes(q);
  });

  renderContactList(filteredContacts);
});

  
  /* ----------------------------
     Render contact list
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
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.padding = '8px';
      row.style.cursor = 'pointer';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = selectedRecipients.has(contact.email);
      checkbox.disabled =
      panel.querySelector('input[name="recipient_mode"]:checked')?.value !== 'manual';


      checkbox.onchange = () => {
        if (checkbox.checked) {
          selectedRecipients.add(contact.email);
        } else {
          selectedRecipients.delete(contact.email);
        }
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

    // Reset state
    selectedRecipients.clear();
    updateSelectedCount();
    contactList.innerHTML = '';

    filterSection.classList.toggle('hidden', mode !== 'filtered');
    manualSection.classList.toggle('hidden', mode !== 'manual');

    // Load contacts ONLY for manual mode
    if (mode === 'manual' && !allContacts.length) {
      contactList.innerHTML = '<p>Loading contacts…</p>';

      google.script.run
        .withSuccessHandler(contacts => {
  allContacts = Array.isArray(contacts) ? contacts : [];
  filteredContacts = allContacts;
  renderContactList(filteredContacts);
})
        .withFailureHandler(err => {
          contactList.innerHTML =
            `<p style="color:red;">Failed to load contacts</p>`;
          console.error(err);
        })
        .getContacts();
    }
  };
});


  /* ----------------------------
     Close handlers
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

  /* ----------------------------
     Animate in
  ---------------------------- */
  requestAnimationFrame(() => overlay.classList.add('open'));

  /* ----------------------------
     Exposed API (for Send later)
  ---------------------------- */
  return {
    getMode: () =>
      panel.querySelector('input[name="recipient_mode"]:checked')?.value,

    getSelectedEmails: () => Array.from(selectedRecipients),

    close
  };
}

