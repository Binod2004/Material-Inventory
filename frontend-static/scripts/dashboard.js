document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  setActiveLink('index.html');

  const alertContainer = document.getElementById('alertContainer');
  const totalMaterials = document.getElementById('totalMaterials');
  const totalSuppliers = document.getElementById('totalSuppliers');
  const lowStockItems = document.getElementById('lowStockItems');
  const availableStock = document.getElementById('availableStock');
  const lowStockTable = document.getElementById('lowStockTable');

  try {
    const metrics = await authFetch('/dashboard');
    const lowStock = await authFetch('/stock/low');

    totalMaterials.textContent = metrics.totalMaterials;
    totalSuppliers.textContent = metrics.totalSuppliers;
    lowStockItems.textContent = metrics.lowStockItems;
    availableStock.textContent = metrics.availableStock;

    if (lowStock.length === 0) {
      lowStockTable.innerHTML = '<tr><td colspan="4">No urgent stock alerts.</td></tr>';
    } else {
      lowStockTable.innerHTML = lowStock.slice(0, 5).map((item) => `
        <tr class="${item.availableStock < item.minimumStock ? 'low-stock' : ''}">
          <td>${item.material?.materialName || 'Unknown'}</td>
          <td>${item.availableStock}</td>
          <td>${item.minimumStock}</td>
          <td>${formatDate(item.lastUpdated)}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    showNotice(alertContainer, 'error', error.message);
  }
});
