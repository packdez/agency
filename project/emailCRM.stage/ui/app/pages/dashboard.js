export function renderDashboard() {
  const div = document.createElement('div');
  div.className = 'panel fade-in';

  div.innerHTML = `
    <h2>Dashboard</h2>
    <p>Welcome to your Email CRM.</p>
  `;

  return div;
}
