import { Sidebar } from './sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderComposer, loadCampaign } from './pages/composer.js';
import { renderCampaigns } from './pages/campaigns.js';

const API_BASE = 'https://emailcrm-clients.raphaellevinders.workers.dev';

export function renderApp(root) {
// -----------------------------
// Client resolution (QUERY PARAM)
// -----------------------------
const params = new URLSearchParams(window.location.search);
const clientId = params.get('client') || 'client_demo';

window.CLIENT_ID = clientId;

console.log('[CLIENT]', window.CLIENT_ID);
  
  window.CLIENT_ID = clientId;

  console.log('[CLIENT]', window.CLIENT_ID);

  /* -----------------------------
     Session bootstrap (once)
  ----------------------------- */
  if (!localStorage.getItem('session_token')) {
    fetch(`${API_BASE}/auth/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: window.CLIENT_ID })
    })
      .then(r => r.json())
      .then(({ token }) => {
        localStorage.setItem('session_token', token);
      })
      .catch(err => {
        console.error('Session init failed', err);
      });
  }

  /* -----------------------------
     App layout
  ----------------------------- */
  const app = root;
  const main = document.createElement('div');
  main.className = 'main';

  function navigate(page) {
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
        break;

      default:
        main.appendChild(renderDashboard());
    }
  }

  function openComposer(campaignId = null) {
    navigate('composer');

    if (campaignId) {
      setTimeout(() => {
        loadCampaign(campaignId);
      }, 0);
    }
  }

  function logout() {
    localStorage.removeItem('session_token');
    showToast('Logged out');
    setTimeout(() => {
      window.location.href = './auth/login.html';
    }, 500);
  }

  const sidebar = Sidebar(navigate, logout);

  app.appendChild(sidebar);
  app.appendChild(main);

  navigate('dashboard');
}
