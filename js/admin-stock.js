/**
 * admin-stock.js — Quản lý tồn kho, cảnh báo dưới ngưỡng, báo cáo Nhập – Xuất – Tồn
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let stockSearchKeyword = '';
let stockCategoryFilter = 'Tất cả';
let stockDateFrom = '';
let stockDateTo = '';

function initStockCategorySelect() {
  const catSelect = document.getElementById('stock-filter-category');
  if (!catSelect) return;

  const curVal = catSelect.value || 'Tất cả';
  const categories = getCategories();
  let html = '<option value="Tất cả">Tất cả loại</option>';
  categories.forEach(c => {
    html += `<option value="${c.name}">${c.name}</option>`;
  });
  catSelect.innerHTML = html;
  catSelect.value = curVal;
}

function renderStockTable() {
  const tbody = document.querySelector('#section-stock tbody');
  const warningBanner = document.querySelector('#section-stock .warning-banner');
  if (!tbody) return;

  initStockCategorySelect();

  const allProducts = getProducts();
  const allReceipts = getReceipts().filter(r => r.status === 'Hoàn thành');
  const allOrders = getOrders().filter(o => o.status !== 'Hủy');

  // 1. Cập nhật dải cảnh báo sắp hết hàng (dựa trên tồn kho thực tế hiện tại)
  const lowStockProds = allProducts.filter(p => Number(p.stock) < 6);
  if (warningBanner) {
    if (lowStockProds.length > 0) {
      const names = lowStockProds.map(p => `<strong>${p.name}</strong> (${p.stock} ${p.unit})`).join(', ');
      warningBanner.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <span><strong>Cảnh báo sắp hết:</strong> ${names} đang dưới ngưỡng an toàn (&lt; 6).</span>
      `;
      warningBanner.style.display = 'flex';
    } else {
      warningBanner.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
          <path d="m5 12 4 4L19 6"/>
        </svg>
        <span>Tất cả sản phẩm hiện đang đạt mức tồn kho an toàn (&ge; 6).</span>
      `;
      warningBanner.style.display = 'flex';
    }
  }

  // 2. Lọc sản phẩm theo loại và từ khóa
  let filteredProducts = allProducts;
  if (stockCategoryFilter !== 'Tất cả') {
    filteredProducts = filteredProducts.filter(p => p.category === stockCategoryFilter || p.categoryId === stockCategoryFilter);
  }
  if (stockSearchKeyword) {
    const kw = stockSearchKeyword.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.id.toLowerCase().includes(kw) ||
      (p.category && p.category.toLowerCase().includes(kw))
    );
  }

  if (filteredProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không tìm thấy sản phẩm nào theo tiêu chí tra cứu.
        </td>
      </tr>
    `;
    return;
  }

  // 3. Phân tách phiếu nhập và đơn hàng theo thời gian
  // Phiếu trong khoảng ngày
  const receiptsInRange = allReceipts.filter(r => isDateInRange(r.date, stockDateFrom, stockDateTo));
  const ordersInRange = allOrders.filter(o => isDateInRange(o.date, stockDateFrom, stockDateTo));

  // Phiếu trước khoảng ngày bắt đầu (để tính tồn đầu kỳ chính xác)
  const receiptsBeforeFrom = stockDateFrom
    ? allReceipts.filter(r => {
        const d = parseDateString(r.date);
        const fromD = parseDateString(stockDateFrom);
        return d && fromD && d.getTime() < fromD.getTime();
      })
    : [];

  const ordersBeforeFrom = stockDateFrom
    ? allOrders.filter(o => {
        const d = parseDateString(o.date);
        const fromD = parseDateString(stockDateFrom);
        return d && fromD && d.getTime() < fromD.getTime();
      })
    : [];

  // 4. Tính toán Nhập - Xuất - Tồn từng sản phẩm
  let html = '';
  let sumInitial = 0;
  let sumImport = 0;
  let sumExport = 0;
  let sumFinal = 0;

  filteredProducts.forEach(p => {
    // Nhập trong kỳ
    let importedQty = 0;
    receiptsInRange.forEach(r => {
      (r.lines || []).forEach(l => {
        if (l.productId === p.id || l.name === p.name) {
          importedQty += Number(l.quantity || 0);
        }
      });
    });

    // Xuất trong kỳ
    let exportedQty = 0;
    ordersInRange.forEach(o => {
      (o.items || []).forEach(i => {
        if (i.productId === p.id || i.name === p.name) {
          exportedQty += Number(i.quantity || 0);
        }
      });
    });

    // Tồn đầu kỳ
    let initialStock = p.initialStock !== undefined ? p.initialStock : 0;
    if (stockDateFrom) {
      let priorImport = 0;
      receiptsBeforeFrom.forEach(r => {
        (r.lines || []).forEach(l => {
          if (l.productId === p.id || l.name === p.name) priorImport += Number(l.quantity || 0);
        });
      });

      let priorExport = 0;
      ordersBeforeFrom.forEach(o => {
        (o.items || []).forEach(i => {
          if (i.productId === p.id || i.name === p.name) priorExport += Number(i.quantity || 0);
        });
      });

      initialStock = Math.max(0, initialStock + priorImport - priorExport);
    }

    // Tồn cuối kỳ
    const finalStock = Math.max(0, initialStock + importedQty - exportedQty);

    sumInitial += initialStock;
    sumImport += importedQty;
    sumExport += exportedQty;
    sumFinal += finalStock;

    let badgeHtml = '';
    if (finalStock <= 0) {
      badgeHtml = `<span class="badge badge-danger">Hết hàng</span>`;
    } else if (finalStock < 6) {
      badgeHtml = `<span class="badge badge-warning">Sắp hết</span>`;
    } else {
      badgeHtml = `<span class="badge badge-success">Còn hàng</span>`;
    }

    html += `
      <tr>
        <td><strong>${p.name}</strong> <small style="color:var(--ink-500);">(${p.id}) · ${p.unit}</small></td>
        <td style="text-align:right;">${initialStock}</td>
        <td style="text-align:right; color:var(--success-fg); font-weight:700;">+${importedQty}</td>
        <td style="text-align:right; color:var(--danger-fg); font-weight:700;">-${exportedQty}</td>
        <td style="text-align:right;"><strong>${finalStock}</strong></td>
        <td>${badgeHtml}</td>
      </tr>
    `;
  });

  // Hàng tổng cộng
  html += `
    <tr class="table-total" style="background:var(--blue-50); font-weight:700;">
      <td><strong>TỔNG CỘNG (${filteredProducts.length} sản phẩm)</strong></td>
      <td style="text-align:right;"><strong>${sumInitial}</strong></td>
      <td style="text-align:right; color:var(--success-fg);"><strong>+${sumImport}</strong></td>
      <td style="text-align:right; color:var(--danger-fg);"><strong>-${sumExport}</strong></td>
      <td style="text-align:right; color:var(--color-primary);"><strong>${sumFinal}</strong></td>
      <td></td>
    </tr>
  `;

  tbody.innerHTML = html;
}

// Gắn sự kiện khi nạp trang
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#section-stock .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      stockSearchKeyword = e.target.value.trim();
      renderStockTable();
    });
  }

  const catSelect = document.getElementById('stock-filter-category');
  if (catSelect) {
    catSelect.addEventListener('change', function(e) {
      stockCategoryFilter = e.target.value;
      renderStockTable();
    });
  }

  const fromInput = document.getElementById('stock-filter-from');
  if (fromInput) {
    fromInput.addEventListener('change', function(e) {
      stockDateFrom = e.target.value;
      renderStockTable();
    });
  }

  const toInput = document.getElementById('stock-filter-to');
  if (toInput) {
    toInput.addEventListener('change', function(e) {
      stockDateTo = e.target.value;
      renderStockTable();
    });
  }

  const clearBtn = document.getElementById('btn-clear-stock-filter');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      stockSearchKeyword = '';
      stockCategoryFilter = 'Tất cả';
      stockDateFrom = '';
      stockDateTo = '';
      if (searchInput) searchInput.value = '';
      if (catSelect) catSelect.value = 'Tất cả';
      if (fromInput) fromInput.value = '';
      if (toInput) toInput.value = '';
      renderStockTable();
    });
  }
});
