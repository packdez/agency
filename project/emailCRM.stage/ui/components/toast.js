let container;

export function showToast(message, type = 'success', duration = 4000) {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} show`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

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
    onConfirm();
  };

  toast.querySelector('.cancel-btn').onclick = cleanup;
}
