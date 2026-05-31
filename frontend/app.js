// Determine API base URL - use environment variable or default based on hostname
const apiBase = window.__API_BASE__ || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:4000/api'
    : '/api'
);

const elements = {
  apiStatus: document.getElementById('api-status'),
  materialsList: document.getElementById('materials-list'),
  suppliersList: document.getElementById('suppliers-list'),
  stockList: document.getElementById('stock-list'),
  formMessage: document.getElementById('form-message'),
  materialForm: document.getElementById('material-form'),
  supplierForm: document.getElementById('supplier-form'),
  stockForm: document.getElementById('stock-form'),
  materialSelect: document.querySelector('#stock-form select[name="material_id"]'),
  supplierSelect: document.querySelector('#stock-form select[name="supplier_id"]'),
  tabButtons: Array.from(document.querySelectorAll('.tab-button'))
};

const state = {
  materials: [],
  suppliers: [],
  stock: []
};

function setApiStatus(text, success = true) {
  elements.apiStatus.textContent = text;
  elements.apiStatus.classList.toggle('status-ok', success);
  elements.apiStatus.classList.toggle('status-failed', !success);
}

function showMessage(text, type = 'success') {
  elements.formMessage.textContent = text;
  elements.formMessage.className = `message ${type}`;
}

function clearMessage() {
  elements.formMessage.textContent = '';
  elements.formMessage.className = 'message';
}

function renderList(items, listElement, itemRenderer) {
  listElement.innerHTML = items.length
    ? items.map(itemRenderer).join('')
    : '<li class="empty">No records found.</li>';
}

function updateDashboard() {
  renderList(state.materials, elements.materialsList, m => `<li><strong>${m.code}</strong> — ${m.name}${m.unit ? ` (${m.unit})` : ''}</li>`);
  renderList(state.suppliers, elements.suppliersList, s => `<li><strong>${s.name}</strong>${s.contact ? ` — ${s.contact}` : ''}</li>`);
  renderList(state.stock, elements.stockList, s => `
    <li>
      <strong>${s.material_code}</strong> — ${s.quantity}
      <span class="meta">Supplier: ${s.supplier_name || 'N/A'}</span>
    </li>
  `);
}

function updateSelectors() {
  elements.materialSelect.innerHTML = `
    <option value="">Select material</option>
    ${state.materials.map(m => `<option value="${m.id}">${m.code} — ${m.name}</option>`).join('')}
  `;
  elements.supplierSelect.innerHTML = `
    <option value="">No supplier</option>
    ${state.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
  `;
}

async function fetchData() {
  try {
    const [materialsRes, suppliersRes, stockRes] = await Promise.all([
      fetch(`${apiBase}/materials`),
      fetch(`${apiBase}/suppliers`),
      fetch(`${apiBase}/stock`)
    ]);

    if (!materialsRes.ok || !suppliersRes.ok || !stockRes.ok) {
      throw new Error('API responded with an error');
    }

    state.materials = await materialsRes.json();
    state.suppliers = await suppliersRes.json();
    state.stock = await stockRes.json();

    setApiStatus('Connected', true);
    updateDashboard();
    updateSelectors();
  } catch (error) {
    setApiStatus('API unavailable', false);
    elements.materialsList.innerHTML = '<li class="empty">Unable to load materials.</li>';
    elements.suppliersList.innerHTML = '<li class="empty">Unable to load suppliers.</li>';
    elements.stockList.innerHTML = '<li class="empty">Unable to load stock levels.</li>';
  }
}

async function postData(path, payload, successMessage) {
  clearMessage();

  try {
    const response = await fetch(`${apiBase}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.error || 'Request failed');
    }

    showMessage(successMessage, 'success');
    await fetchData();
  } catch (error) {
    showMessage(error.message || 'Unable to save the record', 'error');
  }
}

function bindEvents() {
  elements.tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      elements.tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const target = button.dataset.target;
      document.querySelectorAll('.page-section').forEach(section => {
        section.classList.toggle('hidden', section.id !== target);
      });
      clearMessage();
    });
  });

  elements.materialForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(elements.materialForm);
    postData('/materials', {
      code: formData.get('code').trim(),
      name: formData.get('name').trim(),
      unit: formData.get('unit').trim(),
      min_level: Number(formData.get('min_level') || 0)
    }, 'Material created successfully');
    elements.materialForm.reset();
  });

  elements.supplierForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(elements.supplierForm);
    postData('/suppliers', {
      name: formData.get('name').trim(),
      contact: formData.get('contact').trim()
    }, 'Supplier created successfully');
    elements.supplierForm.reset();
  });

  elements.stockForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(elements.stockForm);
    postData('/stock', {
      material_id: Number(formData.get('material_id')),
      supplier_id: formData.get('supplier_id') ? Number(formData.get('supplier_id')) : null,
      quantity: Number(formData.get('quantity') || 0),
      min_level: Number(formData.get('min_level') || 0)
    }, 'Stock level created successfully');
    elements.stockForm.reset();
  });
}

function start() {
  bindEvents();
  fetchData();
}

start();
