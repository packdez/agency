export function createSendPanel({ onClose } = {}) {
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
    </div>

    <div class="send-panel-footer">
      <button class="btn btn-secondary cancel-btn">Cancel</button>
      <button class="btn btn-danger send-btn">Send Campaign</button>
    </div>
  `;

  overlay.appendChild(panel);
  document.body.appendChild(overlay);

  // Close handlers
  overlay.querySelector('.close-btn').onclick = close;
  overlay.querySelector('.cancel-btn').onclick = close;
  overlay.onclick = e => {
    if (e.target === overlay) close();
  };

  // Toggle filter section
  panel.querySelectorAll('input[name="recipient_mode"]').forEach(radio => {
    radio.onchange = e => {
      panel.querySelector('.filter-section')
        .classList.toggle('hidden', e.target.value !== 'filtered');
    };
  });

  function close() {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 200);
    onClose?.();
  }

  // Animate in
  requestAnimationFrame(() => overlay.classList.add('open'));

  return {
    overlay,
    panel
  };
}
