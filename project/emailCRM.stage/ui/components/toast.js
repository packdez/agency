let container;

/* =========================
   Ensure container
========================= */
function ensureContainer() {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
}

/* =========================
   Basic toast
========================= */
export function showToast(message, type = 'success', duration = 4000) {
  ensureContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* =========================
   Confirm toast
========================= */
export function showConfirmToast({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm
}) {
  ensureContainer();

  const toast = document.createElement('div');
  toast.className = 'toast toast-warning';

  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <div class="toast-actions">
      <button class="btn btn-danger confirm-btn">${confirmText}</button>
      <button class="btn btn-secondary cancel-btn">${cancelText}</button>
    </div>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  const cleanup = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  };

  toast.querySelector('.confirm-btn').onclick = () => {
    cleanup();
    onConfirm && onConfirm();
  };

  toast.querySelector('.cancel-btn').onclick = cleanup;
}
