import { Panel } from '../../components/panel.js';

let selectedElementId = null;

const elements = [];

export function renderComposer() {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gridTemplateColumns = '220px 1fr 280px';
  wrapper.style.gap = '16px';
  wrapper.style.height = '100%';

  const library = renderLibrary();
  const canvas = renderCanvas();
  const inspector = renderInspector();

  wrapper.appendChild(library);
  wrapper.appendChild(canvas);
  wrapper.appendChild(inspector);

  return wrapper;
}


function renderLibrary() {
  const panel = Panel(document.createElement('div'));

  panel.innerHTML = `
    <h3>Elements</h3>
    <button class="btn btn-secondary" data-type="text">Text</button>
    <button class="btn btn-secondary" data-type="image">Image</button>
    <button class="btn btn-secondary" data-type="button">Button</button>
    <button class="btn btn-secondary" data-type="divider">Divider</button>
    <button class="btn btn-secondary" data-type="spacer">Spacer</button>
  `;

  panel.querySelectorAll('button').forEach(btn => {
    btn.onclick = () => addElement(btn.dataset.type);
  });

  return panel;
}


function renderCanvas() {
  const container = document.createElement('div');
  container.style.background = '#F8FAFC';
  container.style.padding = '16px';
  container.style.border = '1px dashed #CBD5E1';
  container.style.minHeight = '100%';

  container.id = 'email-canvas';

  refreshCanvas(container);
  return container;
}

function refreshCanvas(container) {
  container.innerHTML = '';

  if (!elements.length) {
    container.innerHTML = '<p style="color:#64748B;">Add elements to start building your email</p>';
    return;
  }

  elements.forEach(el => {
    const block = document.createElement('div');
    block.style.border = el.id === selectedElementId
      ? '2px solid #2563EB'
      : '1px solid #E5E7EB';

    block.style.padding = '12px';
    block.style.marginBottom = '8px';
    block.style.cursor = 'pointer';
    block.style.background = '#FFFFFF';

    block.onclick = () => {
      selectedElementId = el.id;
      refreshUI();
    };

    block.innerHTML = renderElementPreview(el);
    container.appendChild(block);
  });
}


function renderInspector() {
  const panel = Panel(document.createElement('div'));
  panel.id = 'inspector';

  panel.innerHTML = `
    <h3>Inspector</h3>
    <p style="color:#64748B;">Select an element</p>
  `;

  return panel;
}

function refreshInspector() {
  const panel = document.getElementById('inspector');
  panel.innerHTML = '<h3>Inspector</h3>';

  const el = elements.find(e => e.id === selectedElementId);
  if (!el) {
    panel.innerHTML += '<p style="color:#64748B;">Select an element</p>';
    return;
  }

  if (el.type === 'text') {
    const textarea = document.createElement('textarea');
    textarea.value = el.content;
    textarea.style.width = '100%';
    textarea.style.height = '100px';

    textarea.oninput = e => {
      el.content = e.target.value;
      refreshUI();
    };

    panel.appendChild(textarea);
  }

  if (el.type === 'button') {
    const input = document.createElement('input');
    input.value = el.label;
    input.placeholder = 'Button label';
    input.style.width = '100%';

    input.oninput = e => {
      el.label = e.target.value;
      refreshUI();
    };

    panel.appendChild(input);
  }
}


function addElement(type) {
  const id = 'el_' + Date.now();

  const base = { id, type };

  if (type === 'text') base.content = 'New text';
  if (type === 'button') base.label = 'Click me';

  elements.push(base);
  selectedElementId = id;

  refreshUI();
}

function renderElementPreview(el) {
  switch (el.type) {
    case 'text':
      return `<div>${el.content}</div>`;
    case 'button':
      return `<button class="btn btn-primary">${el.label}</button>`;
    case 'divider':
      return `<hr />`;
    case 'spacer':
      return `<div style="height:16px;"></div>`;
    default:
      return `<em>${el.type}</em>`;
  }
}

function refreshUI() {
  refreshCanvas(document.getElementById('email-canvas'));
  refreshInspector();
}
