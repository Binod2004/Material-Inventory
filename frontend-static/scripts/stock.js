document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  setActiveLink('stock.html');

  const form = document.getElementById('stockForm');
  const materialSelect = document.getElementById('stockMaterial');
  const tableBody = document.getElementById('stockTable');
  const searchInput = document.getElementById('stockSearch');
  const notice = document.getElementById('stockNotice');
  const saveButton = document.getElementById('stockSaveButton');

  let stockItems = [];
  let materials = [];
  let editId = null;

  async function loadData() {
    try {
      const [stockRes, materialsRes] = await Promise.all([
        authFetch('/stock'),
        authFetch('/materials')
      ]);

      stockItems = stockRes;
      materials = materialsRes;
      renderMaterialOptions();
      renderStock();
    } catch (error) {
      showNotice(notice, 'error', error.message);
    }
  }

  function renderMaterialOptions() {
    materialSelect.innerHTML = '<option value="">Select material</option>' + materials.map((material) => `
      <option value="${material.materialId}">${material.materialName}</option>
    `).join('');
  }

  function renderStock() {
    const search = searchInput.value.trim().toLowerCase();
    const filtered = stockItems.filter((item) => {
      return item.material?.materialName?.toLowerCase().includes(search) || item.material?.category?.toLowerCase().includes(search);
    });

    tableBody.innerHTML = filtered.map((item) => `
      <tr class="${item.availableStock < item.minimumStock ? 'low-stock' : ''}">
        <td>${item.material?.materialName || 'Unknown'}</td>
        <td>${item.availableStock}</td>
        <td>${item.minimumStock}</td>
        <td>${formatDate(item.lastUpdated)}</td>
        <td>
          <button class="clear" type="button" data-action="edit" data-id="${item.stockId}">Edit</button>
          <button class="danger" type="button" data-action="delete" data-id="${item.stockId}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  async function saveStock(event) {
    event.preventDefault();
    notice.innerHTML = '';

    const payload = {
      materialId: Number(materialSelect.value),
      availableStock: Number(document.getElementById('stockAvailable').value),
      minimumStock: Number(document.getElementById('stockMinimum').value)
    };

    try {
      if (editId) {
        await authFetch(`/stock/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showNotice(notice, 'success', 'Stock updated successfully.');
      } else {
        await authFetch('/stock', { method: 'POST', body: JSON.stringify(payload) });
        showNotice(notice, 'success', 'Stock entry added successfully.');
      }

      editId = null;
      saveButton.textContent = 'Add Stock';
      form.reset();
      loadData();
    } catch (error) {
      showNotice(notice, 'error', error.message);
    }
  }

  async function handleTableClick(event) {
    const button = event.target.closest('button');
    if (!button) return;

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === 'edit') {
      const item = stockItems.find((entry) => String(entry.stockId) === id);
      if (item) {
        editId = item.stockId;
        materialSelect.value = item.material?.materialId || '';
        document.getElementById('stockAvailable').value = item.availableStock;
        document.getElementById('stockMinimum').value = item.minimumStock;
        saveButton.textContent = 'Update Stock';
      }
    }

    if (action === 'delete') {
      if (!confirm('Delete this stock record?')) return;
      try {
        await authFetch(`/stock/${id}`, { method: 'DELETE' });
        showNotice(notice, 'success', 'Stock record deleted successfully.');
        loadData();
      } catch (error) {
        showNotice(notice, 'error', error.message);
      }
    }
  }

  form.addEventListener('submit', saveStock);
  tableBody.addEventListener('click', handleTableClick);
  searchInput.addEventListener('input', renderStock);

  loadData();
});
