export function Sidebar(onNavigate, onLogout) {
  const nav = document.createElement('div');
  nav.style.width = '220px';
  nav.style.background = '#FFFFFF';
  nav.style.borderRight = '1px solid #E5E7EB';
  nav.style.padding = '16px';
  nav.style.display = 'flex';
  nav.style.flexDirection = 'column';
  nav.style.gap = '8px';

  const title = document.createElement('h3');
  title.innerText = 'EmailCRM';
  nav.appendChild(title);

  const links = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'campaigns', label: 'Campaigns' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'settings', label: 'Settings' }
  ];

  links.forEach(link => {
    const btn = document.createElement('button');
    btn.className = 'btn btn-ghost';
    btn.innerText = link.label;
    btn.onclick = () => onNavigate(link.id);
    nav.appendChild(btn);
  });

  nav.appendChild(document.createElement('div')).style.flex = '1';

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn btn-secondary';
  logoutBtn.innerText = 'Logout';
  logoutBtn.onclick = onLogout;

  nav.appendChild(logoutBtn);

  return nav;
}
