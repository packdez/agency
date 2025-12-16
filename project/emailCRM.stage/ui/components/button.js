export function Button({
  label,
  variant = 'primary',
  loading = false,
  onClick
}) {
  const btn = document.createElement('button');
  btn.className = `btn btn-${variant}`;

  btn.innerHTML = loading
    ? `<span class="spinner"></span>`
    : label;

  btn.onclick = e => {
    if (!loading && onClick) onClick(e);
  };

  return btn;
}
