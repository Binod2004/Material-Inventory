document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  setActiveLink('materials.html');

  const form = document.getElementById('materialsForm');
  const tableBody = document.getElementById('materialsTable');
  const supplierSelect = document.getElementById('materialSupplier');
  const searchInput = document.getElementById('materialSearch');
  const notice = document.getElementById('materialsNotice');
  const saveButton = document.getElementById('materialsSaveButton');

  let materials = [];
  let suppliers = [];
  let editId = null;

  const fields = {
    name: document.getElementById('materialName'),
    category: document.getElementById('materialCategory'),
    quantity: document.getElementById('materialQuantity'),
    unitPrice: document.getElementById('materialUnitPrice'),
    supplier: supplierSelect,
    status: document.getElementById('materialStatus')
  };

  async function loadData() {
    try {
      const [materialsRes, suppliersRes] = await Promise.all([
        authFetch('/materials'),
        authFetch('/suppliers')
      ]);

      materials = materialsRes;
      suppliers = suppliersRes;
      renderSupplierOptions();
      renderMaterials();
    } catch (error) {
      showNotice(notice, 'error', error.message);
    }
  }

  function renderSupplierOptions() {
    supplierSelect.innerHTML = '<option value="">Select supplier</option>' + suppliers.map((supplier) => `
      <option value="${supplier.supplierId}">${supplier.supplierName}</option>
    `).join('');
  }

  function renderMaterials() {
    const search = searchInput.value.trim().toLowerCase();
    const filtered = materials.filter((material) => {
      return material.materialName.toLowerCase().includes(search) || (material.category || '').toLowerCase().includes(search);
    });

    tableBody.innerHTML = filtered.map((item) => `
      <tr>
        <td>${item.materialName}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>${item.unitPrice.toFixed(2)}</td>
        <td>${item.supplier?.supplierName || 'N/A'}</td>
        <td>${item.stockStatus}</td>
        <td>
          <button class="clear" type="button" data-action="edit" data-id="${item.materialId}">Edit</button>
          <button class="danger" type="button" data-action="delete" data-id="${item.materialId}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  async function handleSave(event) {
    event.preventDefault();
    notice.innerHTML = '';

    const payload = {
      materialName: fields.name.value.trim(),
      category: fields.category.value.trim(),
      quantity: Number(fields.quantity.value),
      unitPrice: Number(fields.unitPrice.value),
      supplierId: fields.supplier.value ? Number(fields.supplier.value) : null,
      stockStatus: fields.status.value
    };

    try {
      if (editId) {
        await authFetch(`/materials/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        showNotice(notice, 'success', 'Material updated successfully.');
      } else {
        await authFetch('/materials', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        showNotice(notice, 'success', 'Material added successfully.');
      }

      editId = null;
      saveButton.textContent = 'Add Material';
      form.reset();
      await loadData();
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
      const item = materials.find((material) => String(material.materialId) === id);
      if (item) {
        editId = item.materialId;
        fields.name.value = item.materialName;
        fields.category.value = item.category;
        fields.quantity.value = item.quantity;
        fields.unitPrice.value = item.unitPrice;
        fields.supplier.value = item.supplier?.supplierId || '';
        fields.status.value = item.stockStatus;
        saveButton.textContent = 'Update Material';
      }
    }

    if (action === 'delete') {
      if (!confirm('Delete this material?')) return;
      try {
        await authFetch(`/materials/${id}`, { method: 'DELETE' });
        showNotice(notice, 'success', 'Material removed successfully.');
        await loadData();
      } catch (error) {
        showNotice(notice, 'error', error.message);
      }
    }
  }

  form.addEventListener('submit', handleSave);
  tableBody.addEventListener('click', handleTableClick);
  searchInput.addEventListener('input', renderMaterials);

  loadData();
});
