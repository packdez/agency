// TEMP: dynamic attributes (will be loaded from backend later)
const AVAILABLE_ATTRIBUTES = [
  'first_name',
  'last_name',
  'email',
  'company',
  'position',
  'deal_value',
  'phone'
];

import { Panel } from '../../components/panel.js';

let selectedElementId = null;
let activeInput = null;

let currentCampaignId = null;
let currentCampaignName = 'Untitled Campaign';
let currentCampaignSubject = '';


const elements = [];


export function renderComposer() {
  const wrapper = document.createElement('div');
  wrapper.style.display = 'grid';
  wrapper.style.gridTemplateColumns = '220px 1fr 280px';
  wrapper.style.gap = '16px';
  wrapper.style.height = '100%';

  const library = renderLibrary();
const saveBtn = document.createElement('button');
saveBtn.className = 'btn btn-primary';
saveBtn.innerText = 'Save Campaign';
saveBtn.onclick = saveCampaign;

library.appendChild(saveBtn);

  const previewBtn = document.createElement('button');
previewBtn.className = 'btn btn-secondary';
previewBtn.innerText = 'Preview';
previewBtn.style.marginTop = '8px';
previewBtn.onclick = previewCampaign;

library.appendChild(previewBtn);


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

  textarea.onfocus = () => {
    activeInput = textarea;
  };

textarea.oninput = e => {
  el.settings.content = e.target.value;
  // ❌ do NOT call refreshUI here
};


  panel.appendChild(textarea);
  panel.appendChild(renderAttributePicker(el, 'content'));
}


if (el.type === 'button') {
  const input = document.createElement('input');
  input.value = el.label;
  input.placeholder = 'Button label';
  input.style.width = '100%';

  input.onfocus = () => {
    activeInput = input;
  };

input.oninput = e => {
  el.settings.label = e.target.value;
  // ❌ no refreshUI here
};


  panel.appendChild(input);
  panel.appendChild(renderAttributePicker(el, 'label'));
}

}


function renderAttributePicker(el, field) {
  const wrapper = document.createElement('div');
  wrapper.style.marginTop = '12px';

  const label = document.createElement('div');
  label.innerText = 'Insert attribute';
  label.style.fontSize = '12px';
  label.style.color = '#64748B';
  label.style.marginBottom = '4px';

  const select = document.createElement('select');
  select.style.width = '100%';
  select.style.padding = '6px';
  select.style.borderRadius = '6px';
  select.style.border = '1px solid #E5E7EB';

  const defaultOpt = document.createElement('option');
  defaultOpt.innerText = 'Select attribute';
  defaultOpt.value = '';
  select.appendChild(defaultOpt);

  AVAILABLE_ATTRIBUTES.forEach(attr => {
    const opt = document.createElement('option');
    opt.value = attr;
    opt.innerText = attr;
    select.appendChild(opt);
  });

  select.onchange = () => {
    if (!select.value || !activeInput) return;

    insertAtCursor(activeInput, `{{${select.value}}}`);
    el[field] = activeInput.value;
    select.value = '';
    refreshUI();
  };

  wrapper.appendChild(label);
  wrapper.appendChild(select);

  return wrapper;
}


function addElement(type) {
  const id = 'el_' + Date.now();

  const base = {
    id,
    type,
    settings: {},
    styles: {}
  };

  if (type === 'text') {
    base.settings.content = 'New text';
  }

  if (type === 'button') {
    base.settings.label = 'Click me';
    base.settings.url = '';
  }

  elements.push(base);
  selectedElementId = id;
  refreshUI();
}


function renderElementPreview(el) {
  switch (el.type) {
    case 'text':
  return `<div>${el.settings.content || ''}</div>`;
  case 'button':
    return `<button class="btn btn-primary">${el.settings.label || ''}</button>`;
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


function insertAtCursor(input, text) {
  const start = input.selectionStart;
  const end = input.selectionEnd;

  const before = input.value.substring(0, start);
  const after = input.value.substring(end);

  input.value = before + text + after;
  input.selectionStart = input.selectionEnd = start + text.length;
}

function saveCampaign() {
  const campaign = {
    campaign_id: currentCampaignId,
    name: currentCampaignName,
    subject: currentCampaignSubject,
    body_json: {
      elements
    }
  };

  google.script.run
    .withSuccessHandler(res => {
      currentCampaignId = res.campaign_id;
      showToast('Campaign saved');
    })
    .withFailureHandler(err => {
      showToast(err.message || 'Failed to save', 'danger');
    })
    .saveCampaign(campaign);
}



function loadCampaign(campaignId) {
  google.script.run
    .withSuccessHandler(campaign => {
      currentCampaignId = campaign.campaign_id;
      currentCampaignName = campaign.name;
      currentCampaignSubject = campaign.subject || '';

      elements.length = 0;
      campaign.body_json.elements.forEach(el => elements.push(el));

      selectedElementId = null;
      refreshUI();
      showToast('Campaign loaded');
    })
    .withFailureHandler(err => {
      showToast(err.message || 'Failed to load', 'danger');
    })
    .getCampaign(campaignId);
}


function previewCampaign() {
  const bodyJson = {
    elements
  };

  google.script.run
    .withSuccessHandler(html => {
      const previewWindow = window.open('', '_blank');
      previewWindow.document.open();
      previewWindow.document.write(html);
      previewWindow.document.close();
    })
    .withFailureHandler(err => {
      showToast(err.message || 'Preview failed', 'danger');
    })
    .previewCampaignFromUI(bodyJson);
}





