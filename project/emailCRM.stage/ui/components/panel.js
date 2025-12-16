export function Panel(content) {
  const div = document.createElement('div');
  div.className = 'panel';
  div.appendChild(content);
  return div;
}
