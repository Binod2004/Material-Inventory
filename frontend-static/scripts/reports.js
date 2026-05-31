document.addEventListener('DOMContentLoaded', async () => {
  requireAuth();
  setActiveLink('reports.html');

  const tableBody = document.getElementById('reportsTable');
  const notice = document.getElementById('reportsNotice');

  try {
    const lowStock = await authFetch('/stock/low');
    if (lowStock.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4">No low stock items at this time.</td></tr>';
    } else {
      tableBody.innerHTML = lowStock.map((item) => `
        <tr class="low-stock">
          <td>${item.material?.materialName || 'Unknown'}</td>
          <td>${item.availableStock}</td>
          <td>${item.minimumStock}</td>
          <td>${formatDate(item.lastUpdated)}</td>
        </tr>
      `).join('');
    }
  } catch (error) {
    showNotice(notice, 'error', error.message);
  }
});
