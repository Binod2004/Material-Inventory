document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  setActiveLink('suppliers.html');

  const form = document.getElementById('suppliersForm');
  const tableBody = document.getElementById('suppliersTable');
  const searchInput = document.getElementById('supplierSearch');
  const notice = document.getElementById('suppliersNotice');
  const saveButton = document.getElementById('suppliersSaveButton');

  let suppliers = [];
  let editId = null;

  const fields = {
    name: document.getElementById('supplierName'),
    phone: document.getElementById('supplierPhone'),
    email: document.getElementById('supplierEmail'),
    address: document.getElementById('supplierAddress')
  };

  async function loadSuppliers() {
    try {
      suppliers = await authFetch('/suppliers');
      renderSuppliers();
    } catch (error) {
      showNotice(notice, 'error', error.message);
    }
  }

  function renderSuppliers() {
    const search = searchInput.value.trim().toLowerCase();
    const filtered = suppliers.filter((supplier) => {
      return supplier.supplierName.toLowerCase().includes(search) || supplier.email?.toLowerCase().includes(search);
    });

    tableBody.innerHTML = filtered.map((item) => `
      <tr>
        <td>${item.supplierName}</td>
        <td>${item.phone || '-'}</td>
        <td>${item.email || '-'}</td>
        <td>${item.address || '-'}</td>
        <td>
          <button class="clear" type="button" data-action="edit" data-id="${item.supplierId}">Edit</button>
          <button class="danger" type="button" data-action="delete" data-id="${item.supplierId}">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  async function handleSave(event) {
    event.preventDefault();
    notice.innerHTML = '';

    const payload = {
      supplierName: fields.name.value.trim(),
      phone: fields.phone.value.trim(),
      email: fields.email.value.trim(),
      address: fields.address.value.trim()
    };

    try {
      if (editId) {
        await authFetch(`/suppliers/${editId}`, { method: 'PUT', body: JSON.stringify(payload) });
        showNotice(notice, 'success', 'Supplier updated successfully.');
      } else {
        await authFetch('/suppliers', { method: 'POST', body: JSON.stringify(payload) });
        showNotice(notice, 'success', 'Supplier added successfully.');
      }
      editId = null;
      saveButton.textContent = 'Add Supplier';
      form.reset();
      loadSuppliers();
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
      const supplier = suppliers.find((item) => String(item.supplierId) === id);
      if (supplier) {
        editId = supplier.supplierId;
        fields.name.value = supplier.supplierName;
        fields.phone.value = supplier.phone || '';
        fields.email.value = supplier.email || '';
        fields.address.value = supplier.address || '';
        saveButton.textContent = 'Update Supplier';
      }
    }

    if (action === 'delete') {
      if (!confirm('Delete this supplier?')) return;
      try {
        await authFetch(`/suppliers/${id}`, { method: 'DELETE' });
        showNotice(notice, 'success', 'Supplier removed successfully.');
        loadSuppliers();
      } catch (error) {
        showNotice(notice, 'error', error.message);
      }
    }
  }

  form.addEventListener('submit', handleSave);
  tableBody.addEventListener('click', handleTableClick);
  searchInput.addEventListener('input', renderSuppliers);

  loadSuppliers();
});
