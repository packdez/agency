let container;

window.showToast = function (message, type = 'success') {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type} slide-up`;
  toast.innerText = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
};

window.showConfirmToast = function ({
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
};
