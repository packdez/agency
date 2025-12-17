import { Sidebar } from './sidebar.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderComposer } from './pages/composer.js';
import { renderCampaigns } from './pages/campaigns.js';

export function renderApp(root) {
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


      case 'composer':
        main.appendChild(renderComposer());
        break;

      default:
        main.innerHTML = '<p>Coming soon</p>';
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
