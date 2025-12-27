let container;

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

export function showConfirmToast({ message, confirmText, cancelText, onConfirm }) {
  const toast = document.createElement('div');
  toast.className = 'toast toast-warning show';

  toast.innerHTML = `
    <div>${message}</div>
    <div class="toast-actions">
      <button class="btn btn-danger confirm">${confirmText}</button>
      <button class="btn btn-secondary cancel">${cancelText}</button>
    </div>
  `;

  document.body.appendChild(toast);

  toast.querySelector('.confirm').onclick = () => {
    toast.remove();
    onConfirm();
  };

  toast.querySelector('.cancel').onclick = () => toast.remove();
}
