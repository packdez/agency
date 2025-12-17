export function renderCampaigns() {
  const div = document.createElement('div');
  div.className = 'panel fade-in';

  div.innerHTML = `
    <h2>Campaigns</h2>
    <p>Campaign list will live here.</p>
  `;

  return div;
}
