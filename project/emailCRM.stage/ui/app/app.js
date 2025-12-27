import { Sidebar } from './sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderCampaigns } from './pages/campaigns.js';
import { renderComposer, loadCampaign } from './pages/composer.js';

/* =============================
   API
============================= */

export const API_BASE =
  'https://emailcrm-clients.raphaellevinders.workers.dev';

export function apiFetch(path, body = null) {
  return fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CLIENT-ID': window.CLIENT_ID,
      'X-CLIENT-KEY': window.CLIENT_KEY
    },
    body: body ? JSON.stringify(body) : null
  }).then(async r => {
    const data = await r.json();
    if (!r.ok) throw data;
    return data;
  });
}

/* =============================
   App bootstrap
============================= */

export function renderApp(root) {
  const params = new URLSearchParams(window.location.search);

  window.CLIENT_ID = params.get('client') || 'client_demo';
  window.CLIENT_KEY = 'server-to-server-secret';

  console.log('[CLIENT]', window.CLIENT_ID);

  const main = document.createElement('div');
  main.className = 'main';

  function navigate(page, id = null) {
    main.innerHTML = '';

    switch (page) {
      case 'dashboard':
        main.appendChild(renderDashboard());
        break;

      case 'campaigns':
        main.appendChild(renderCampaigns(openComposer));
        break;

      case 'composer':
        main.appendChild(renderComposer());
        if (id) loadCampaign(id);
        break;

      default:
        main.appendChild(renderDashboard());
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
