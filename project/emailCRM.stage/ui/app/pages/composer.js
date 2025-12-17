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
