/**
 * admin-pricing.js — Quản lý giá bán, tính % lợi nhuận thời gian thực
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let pricingSearchKeyword = '';
let pricingCategoryFilter = 'Tất cả';

function initPricingCategoryControls() {
  const categories = getCategories();

  // 1. Dropdown lọc theo loại
  const filterSelect = document.getElementById('pricing-filter-category');
  if (filterSelect) {
    const curVal = filterSelect.value || 'Tất cả';
    let optionsHtml = '<option value="Tất cả">Tất cả loại</option>';
    categories.forEach(c => {
      optionsHtml += `<option value="${c.name}">${c.name}</option>`;
    });
    filterSelect.innerHTML = optionsHtml;
    filterSelect.value = curVal;
  }

  // 2. Dropdown chọn loại để áp dụng % hàng loạt
  const batchSelect = document.getElementById('pricing-batch-category');
  if (batchSelect && categories.length > 0) {
    const curVal = batchSelect.value;
    let optionsHtml = '';
    categories.forEach(c => {
      optionsHtml += `<option value="${c.name}">${c.name}</option>`;
    });
    batchSelect.innerHTML = optionsHtml;
    if (curVal) batchSelect.value = curVal;
  }
}

function renderPricingTable() {
  const tbody = document.querySelector('#section-pricing tbody');
  if (!tbody) return;

  initPricingCategoryControls();

  let products = getProducts();

  // Lọc theo loại sản phẩm
  if (pricingCategoryFilter !== 'Tất cả') {
    products = products.filter(p => p.category === pricingCategoryFilter || p.categoryId === pricingCategoryFilter);
  }

  // Lọc theo từ khóa tìm kiếm
  if (pricingSearchKeyword) {
    const kw = pricingSearchKeyword.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.id.toLowerCase().includes(kw) ||
      (p.category && p.category.toLowerCase().includes(kw))
    );
  }

  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  products.forEach(p => {
    const cost = p.costPrice || Math.round(p.price / 1.3);
    const margin = p.profitMargin !== undefined ? p.profitMargin : 30;
    const calcPrice = p.price;

    html += `
      <tr data-product-id="${p.id}">
        <td class="table-product">
          <img src="${p.image}" alt="${p.name}" width="45" height="45" onerror="this.style.display='none'">
          <span>${p.name}<small>${p.id}</small></span>
        </td>
        <td>${p.category}</td>
        <td>${formatMoney(cost)}</td>
        <td>
          <input class="profit-input" type="number" value="${margin}" min="0" max="200" step="1"
            aria-label="Lợi nhuận % của ${p.name}"
            onchange="handleProfitMarginChange('${p.id}', this.value, ${cost})"
            oninput="previewSellingPrice(this, ${cost})">
        </td>
        <td><strong class="calculated-price" style="color:var(--color-primary);">${formatMoney(calcPrice)}</strong></td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Xem trước giá bán ngay khi đang gõ
function previewSellingPrice(inputEl, costPrice) {
  const margin = Number(inputEl.value) || 0;
  const newPrice = Math.round(costPrice * (1 + margin / 100));
  const row = inputEl.closest('tr');
  if (row) {
    const priceCell = row.querySelector('.calculated-price');
    if (priceCell) priceCell.textContent = formatMoney(newPrice);
  }
}

// Lưu giá bán khi hoàn tất đổi % lợi nhuận từng sản phẩm
function handleProfitMarginChange(productId, marginValue, costPrice) {
  const margin = Math.max(0, Number(marginValue) || 0);
  const newPrice = Math.round(costPrice * (1 + margin / 100));

  const updated = updateProduct(productId, {
    profitMargin: margin,
    price: newPrice
  });

  if (updated) {
    showToast(`Đã cập nhật giá bán "${updated.name}": ${formatMoney(newPrice)} (+${margin}%)`);
    if (typeof renderAdminProductTable === 'function') renderAdminProductTable();
  }
}

// Áp dụng % lợi nhuận cho toàn bộ sản phẩm thuộc loại đã chọn
function handleApplyBatchCategoryMargin() {
  const batchSelect = document.getElementById('pricing-batch-category');
  const marginInput = document.getElementById('pricing-batch-margin');

  if (!batchSelect || !marginInput) return;

  const targetCategory = batchSelect.value;
  const margin = Math.max(0, Number(marginInput.value) || 0);

  if (!targetCategory) {
    showToast('Vui lòng chọn loại sản phẩm', 'warning');
    return;
  }

  const products = getProducts();
  let updatedCount = 0;

  products.forEach(p => {
    if (p.category === targetCategory || p.categoryId === targetCategory) {
      const cost = p.costPrice || Math.round(p.price / 1.3);
      p.profitMargin = margin;
      p.price = Math.round(cost * (1 + margin / 100));
      updatedCount++;
    }
  });

  if (updatedCount > 0) {
    saveProducts(products);
    showToast(`Đã áp dụng tỉ lệ lợi nhuận ${margin}% cho ${updatedCount} sản phẩm loại "${targetCategory}"`);
    renderPricingTable();
    if (typeof renderAdminProductTable === 'function') renderAdminProductTable();
  } else {
    showToast(`Không có sản phẩm nào thuộc loại "${targetCategory}"`, 'warning');
  }
}

// Gắn sự kiện trang quản lý giá
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#section-pricing .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      pricingSearchKeyword = e.target.value.trim();
      renderPricingTable();
    });
  }

  const filterSelect = document.getElementById('pricing-filter-category');
  if (filterSelect) {
    filterSelect.addEventListener('change', function(e) {
      pricingCategoryFilter = e.target.value;
      renderPricingTable();
    });
  }

  const applyBtn = document.getElementById('btn-apply-category-margin');
  if (applyBtn) {
    applyBtn.addEventListener('click', handleApplyBatchCategoryMargin);
  }
});
