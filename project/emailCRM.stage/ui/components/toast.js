let container;

/* -----------------------------
   Toast
----------------------------- */
export function showToast(message, type = 'success', duration = 4000) {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} show`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* -----------------------------
   Confirm Toast
----------------------------- */
export function showConfirmToast({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm
}) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-warning show';

  toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <div class="toast-actions">
      <button class="btn btn-danger confirm-btn">${confirmText}</button>
      <button class="btn btn-secondary cancel-btn">${cancelText}</button>
    </div>
  `;

  document.body.appendChild(toast);

  const cleanup = () => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 200);
  };

  toast.querySelector('.confirm-btn').onclick = () => {
    cleanup();
    if (typeof onConfirm === 'function') onConfirm();
  };

  toast.querySelector('.cancel-btn').onclick = cleanup;
}
