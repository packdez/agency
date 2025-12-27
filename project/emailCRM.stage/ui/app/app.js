import { Sidebar } from './sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCampaigns } from './pages/campaigns.js';
import { renderComposer, loadCampaign } from './pages/composer.js';

export const API_BASE =
  'https://emailcrm-clients.raphaellevinders.workers.dev';

export function renderApp(root) {
  const params = new URLSearchParams(window.location.search);
  window.CLIENT_ID = params.get('client') || 'client_demo';
  window.CLIENT_KEY = 'server-to-server-secret';

  const main = document.createElement('div');
  main.className = 'main';

  function navigate(page, id = null) {
    main.innerHTML = '';

    if (page === 'dashboard') main.appendChild(renderDashboard());
    if (page === 'campaigns') main.appendChild(renderCampaigns(openComposer));
    if (page === 'composer') {
      main.appendChild(renderComposer());
      if (id) loadCampaign(id);
    }
  }

  function openComposer(id = null) {
    navigate('composer', id);
  }

  const sidebar = Sidebar(navigate);
  root.appendChild(sidebar);
  root.appendChild(main);

  navigate('dashboard');
}
