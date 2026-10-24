/**
 * shop-products.js — Danh sách sản phẩm, lọc theo chip, tìm cơ bản/nâng cao, chi tiết sản phẩm
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let currentCategory = 'Tất cả';
let currentSearchKeyword = '';
let currentSort = 'popular';
let currentPage = 1;
const PER_PAGE = 8;

// Lấy danh sách sản phẩm đã lọc và sắp xếp
function getFilteredProducts() {
  const hiddenCats = getCategories().filter(c => c.isVisible === false).map(c => c.name);
  let products = getProducts().filter(p => p.isVisible !== false && !hiddenCats.includes(p.category));

  // Lọc theo loại
  if (currentCategory !== 'Tất cả') {
    products = products.filter(p => p.category === currentCategory || p.categoryId === currentCategory);
  }

  // Lọc theo từ khóa tìm kiếm nhanh
  if (currentSearchKeyword) {
    const kw = currentSearchKeyword.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      (p.category && p.category.toLowerCase().includes(kw)) ||
      (p.description && p.description.toLowerCase().includes(kw))
    );
  }

  // Sắp xếp
  if (currentSort === 'asc') {
    products.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'desc') {
    products.sort((a, b) => b.price - a.price);
  } else {
    // Phổ biến nhất: ưu tiên hàng bán chạy rồi đến thứ tự mặc định
    products.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
  }

  return products;
}

// Render lưới sản phẩm trên trang chủ
function renderShopProducts() {
  const container = document.querySelector('#products .product-grid');
  if (!container) return;

  const filtered = getFilteredProducts();
  const pageData = paginate(filtered, currentPage, PER_PAGE);

  // Cập nhật dòng kết quả: "Hiển thị 1–8 trong 19 sản phẩm"
  const resultsRow = document.querySelector('.results-row span');
  if (resultsRow) {
    if (pageData.totalItems === 0) {
      resultsRow.innerHTML = 'Hiển thị <strong>0</strong> sản phẩm';
    } else {
      resultsRow.innerHTML = `Hiển thị <strong>${pageData.startIndex + 1}–${pageData.endIndex}</strong> trong ${pageData.totalItems} sản phẩm`;
    }
  }

  if (pageData.items.length === 0) {
    container.innerHTML = `
      <div class="empty" style="grid-column: 1 / -1; padding: 48px 16px; text-align: center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="color:var(--ink-500); margin:0 auto 16px;">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3 style="font-size:20px; margin-bottom:8px;">Chưa tìm thấy sản phẩm phù hợp</h3>
        <p style="color:var(--ink-600); margin-bottom:16px;">Hãy thử tên món ốc khác hoặc xóa bộ lọc.</p>
        <button class="btn btn-secondary" onclick="resetFilters()">Xem tất cả sản phẩm</button>
      </div>
    `;
    renderPagination(0, 1);
    return;
  }

  let html = '';
  pageData.items.forEach((p, idx) => {
    const isOutOfStock = Number(p.stock) <= 0;
    const isLowStock = Number(p.stock) > 0 && Number(p.stock) < 6;

    let badgeHtml = '';
    if (isOutOfStock) {
      badgeHtml = `<span class="stock-badge badge-danger"><span class="status-dot"></span> Hết hàng</span>`;
    } else if (isLowStock) {
      badgeHtml = `<span class="stock-badge badge-warning"><span class="status-dot"></span> Sắp hết</span>`;
    } else {
      badgeHtml = `<span class="stock-badge badge-success"><span class="status-dot"></span> Còn hàng</span>`;
    }

    const bestSellerHtml = p.isBestSeller ? `<span class="favorite-badge">Bán chạy</span>` : '';

    html += `
      <article class="product-card reveal is-visible" style="--i:${idx}">
        <div class="thumb" onclick="openProductDetailModal('${p.id}')">
          <img src="${p.image}" alt="${p.name}" width="800" height="600" onerror="this.style.display='none'">
          ${badgeHtml}
          ${bestSellerHtml}
        </div>
        <div class="product-body">
          <span class="product-category">${p.category} <span>·</span> ${p.unit}</span>
          <a href="javascript:void(0)" class="product-title" onclick="openProductDetailModal('${p.id}')">${p.name}</a>
          <p class="price">${formatMoney(p.price)} <small>/ ${p.unit}</small></p>
          <button class="btn-add" ${isOutOfStock ? 'disabled' : ''} onclick="handleAddToCart('${p.id}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01"/>
            </svg>
            ${isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </article>
    `;
  });

  container.innerHTML = html;
  renderPagination(pageData.totalPages, pageData.currentPage);
}

// Render phân trang
function renderPagination(totalPages, activePage) {
  const pagEl = document.querySelector('#products .pagination');
  if (!pagEl) return;

  if (totalPages <= 1) {
    pagEl.innerHTML = '';
    return;
  }

  let html = '';
  // Nút trước
  html += `<button type="button" aria-label="Trang trước" class="page-btn page-arrow ${activePage === 1 ? 'is-disabled' : ''}" ${activePage === 1 ? 'disabled' : ''} onclick="goToPage(${activePage - 1})">&#8249;</button>`;

  // Các trang
  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="page-btn page-num ${activePage === i ? 'is-active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }

  // Nút sau
  html += `<button type="button" aria-label="Trang sau" class="page-btn page-arrow ${activePage === totalPages ? 'is-disabled' : ''}" ${activePage === totalPages ? 'disabled' : ''} onclick="goToPage(${activePage + 1})">&#8250;</button>`;

  pagEl.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderShopProducts();
  const pEl = document.getElementById('products');
  if (pEl) pEl.scrollIntoView({ behavior: 'smooth' });
}

function resetFilters() {
  currentCategory = 'Tất cả';
  currentSearchKeyword = '';
  currentPage = 1;

  // Cập nhật chip UI
  document.querySelectorAll('.chips .chip').forEach(btn => {
    if (btn.textContent.trim() === 'Tất cả') {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  const searchInput = document.querySelector('.quick-search input');
  if (searchInput) searchInput.value = '';

  renderShopProducts();
}

window.filterProductsByKeyword = function(keyword) {
  currentSearchKeyword = keyword;
  currentPage = 1;
  renderShopProducts();
};

function handleAddToCart(productId) {
  if (typeof addToCart === 'function') {
    addToCart(productId, 1);
  }
}

// Modal chi tiết sản phẩm
function openProductDetailModal(productId) {
  const p = getProductById(productId);
  if (!p) return;

  const modalEl = document.getElementById('modal-product-detail');
  if (!modalEl) return;

  const modalSection = modalEl.querySelector('.product-modal');
  if (!modalSection) return;

  const isOutOfStock = Number(p.stock) <= 0;
  const isLowStock = Number(p.stock) > 0 && Number(p.stock) < 6;

  let badgeHtml = '';
  if (isOutOfStock) {
    badgeHtml = `<span class="badge badge-danger">Hết hàng</span>`;
  } else if (isLowStock) {
    badgeHtml = `<span class="badge badge-warning">Sắp hết</span>`;
  } else {
    badgeHtml = `<span class="badge badge-success">Còn hàng</span>`;
  }

  modalSection.innerHTML = `
    <button class="icon-button modal-close" aria-label="Đóng chi tiết" onclick="closeModal('modal-product-detail')">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m6 6 12 12M6 18 18 6"/>
      </svg>
    </button>
    <img src="${p.image}" alt="${p.name}" width="800" height="600" onerror="this.style.display='none'">
    <div>
      <span class="eyebrow">${p.category}</span>
      <h2>${p.name}</h2>
      <div style="display:flex; gap:8px; margin: 8px 0 16px;">
        <span class="badge badge-info">Xuất xứ: Việt Nam</span>
        ${badgeHtml}
      </div>
      <p style="color:var(--ink-700); line-height:1.6; margin-bottom:16px;">${p.description || 'Tuyển chọn mỗi ngày từ nguồn hải sản uy tín. Tươi ngon, chất lượng, phù hợp cho những bữa ăn cùng gia đình và bạn bè.'}</p>
      <p class="price" style="font-size:24px; margin-bottom:16px;">${formatMoney(p.price)} <small style="font-size:16px; color:var(--ink-500)">/ ${p.unit}</small></p>
      
      <div class="field" style="max-width:180px;">
        <label for="modal-qty">Số lượng (${p.unit})</label>
        <input class="input" type="number" id="modal-qty" value="1" min="1" max="${p.stock || 1}" ${isOutOfStock ? 'disabled' : ''}>
      </div>
      
      <button class="btn btn-primary full" id="btn-modal-add" ${isOutOfStock ? 'disabled' : ''} style="margin-top:16px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01"/>
        </svg>
        ${isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
      </button>
    </div>
  `;

  openModal('modal-product-detail');

  const addBtn = document.getElementById('btn-modal-add');
  if (addBtn && !isOutOfStock) {
    addBtn.onclick = function() {
      const qtyInput = document.getElementById('modal-qty');
      const qty = Math.max(1, Math.min(Number(p.stock), Number(qtyInput.value) || 1));
      handleAddToCart(p.id, qty);
      closeModal('modal-product-detail');
    };
  }
}

// Tìm kiếm nâng cao
let advancedSearchResults = [];
let advancedSearchPage = 1;
const ADVANCED_PER_PAGE = 8;

function populateAdvancedSearchCategories() {
  const select = document.getElementById('search-category');
  if (!select) return;
  const categories = getCategories().filter(c => c.isVisible !== false);
  let html = '<option value="Tất cả">Tất cả</option>';
  categories.forEach(c => {
    html += `<option value="${c.name}">${c.name}</option>`;
  });
  select.innerHTML = html;
}

function renderAdvancedSearchResults(page = 1) {
  advancedSearchPage = page;
  const resultsGrid = document.querySelector('#section-search .product-grid');
  const paginationEl = document.getElementById('search-pagination');
  if (!resultsGrid) return;

  if (advancedSearchResults.length === 0) {
    resultsGrid.innerHTML = `
      <div class="empty" style="grid-column: 1 / -1; padding: 48px 16px; text-align: center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="color:var(--ink-500); margin:0 auto 16px;">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <h3 style="font-size:20px; margin-bottom:8px;">Không tìm thấy món ốc nào phù hợp</h3>
        <p style="color:var(--ink-600);">Thử nới lỏng mức giá hoặc chọn loại sản phẩm khác.</p>
      </div>
    `;
    if (paginationEl) paginationEl.innerHTML = '';
    return;
  }

  const pageData = paginate(advancedSearchResults, advancedSearchPage, ADVANCED_PER_PAGE);

  let html = '';
  pageData.items.forEach((p, idx) => {
    const isOutOfStock = Number(p.stock) <= 0;
    html += `
      <article class="product-card reveal is-visible" style="--i:${idx}">
        <div class="thumb" onclick="openProductDetailModal('${p.id}')">
          <img src="${p.image}" alt="${p.name}" width="800" height="600" onerror="this.style.display='none'">
          <span class="stock-badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}">${isOutOfStock ? 'Hết hàng' : 'Còn hàng'}</span>
        </div>
        <div class="product-body">
          <span class="product-category">${p.category} · ${p.unit}</span>
          <a href="javascript:void(0)" class="product-title" onclick="openProductDetailModal('${p.id}')">${p.name}</a>
          <p class="price">${formatMoney(p.price)} <small>/ ${p.unit}</small></p>
          <button class="btn-add" ${isOutOfStock ? 'disabled' : ''} onclick="handleAddToCart('${p.id}')">
            ${isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
        </div>
      </article>
    `;
  });
  resultsGrid.innerHTML = html;

  if (paginationEl) {
    if (pageData.totalPages <= 1) {
      paginationEl.innerHTML = '';
      return;
    }
    let pagHtml = `<button type="button" aria-label="Trang trước" class="page-btn page-arrow ${pageData.currentPage === 1 ? 'is-disabled' : ''}" ${pageData.currentPage === 1 ? 'disabled' : ''} onclick="renderAdvancedSearchResults(${pageData.currentPage - 1})">&#8249;</button>`;
    for (let i = 1; i <= pageData.totalPages; i++) {
      pagHtml += `<button type="button" class="page-btn page-num ${pageData.currentPage === i ? 'is-active' : ''}" onclick="renderAdvancedSearchResults(${i})">${i}</button>`;
    }
    pagHtml += `<button type="button" aria-label="Trang sau" class="page-btn page-arrow ${pageData.currentPage === pageData.totalPages ? 'is-disabled' : ''}" ${pageData.currentPage === pageData.totalPages ? 'disabled' : ''} onclick="renderAdvancedSearchResults(${pageData.currentPage + 1})">&#8250;</button>`;
    paginationEl.innerHTML = pagHtml;
  }
}

function initAdvancedSearch() {
  const form = document.querySelector('.advanced-filter');
  if (!form) return;

  populateAdvancedSearchCategories();

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameInput = document.getElementById('search-name').value.trim().toLowerCase();
    const catSelect = document.getElementById('search-category').value;
    const minPrice = Number(document.getElementById('search-min').value) || 0;
    const maxPrice = Number(document.getElementById('search-max').value) || Infinity;

    let products = getProducts().filter(p => p.isVisible !== false);

    if (nameInput) {
      products = products.filter(p => p.name.toLowerCase().includes(nameInput));
    }
    if (catSelect && catSelect !== 'Tất cả') {
      products = products.filter(p => p.category === catSelect || p.categoryId === catSelect);
    }
    if (minPrice > 0) {
      products = products.filter(p => p.price >= minPrice);
    }
    if (maxPrice < Infinity && maxPrice > 0) {
      products = products.filter(p => p.price <= maxPrice);
    }

    advancedSearchResults = products;
    renderAdvancedSearchResults(1);
  });

  // Nút xóa lọc
  const resetBtn = form.querySelector('.btn-secondary');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      form.reset();
      advancedSearchResults = [];
      const resultsGrid = document.querySelector('#section-search .product-grid');
      if (resultsGrid) resultsGrid.innerHTML = '';
      const paginationEl = document.getElementById('search-pagination');
      if (paginationEl) paginationEl.innerHTML = '';
    });
  }
}

function renderCategoryChips() {
  const chipsContainer = document.querySelector('.product-toolbar .chips');
  if (!chipsContainer) return;

  const categories = getCategories().filter(c => c.isVisible !== false);
  let html = `<button class="chip ${currentCategory === 'Tất cả' ? 'is-active' : ''}" type="button">Tất cả</button>`;
  categories.forEach(c => {
    html += `<button class="chip ${currentCategory === c.name ? 'is-active' : ''}" type="button">${c.name}</button>`;
  });
  chipsContainer.innerHTML = html;

  chipsContainer.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
      chipsContainer.querySelectorAll('.chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentCategory = chip.textContent.trim();
      currentPage = 1;
      renderShopProducts();
    });
  });
}

// Khởi tạo sự kiện trên trang
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('products')) return;

  // 1. Render và gắn sự kiện các Chip lọc loại
  renderCategoryChips();

  // 2. Gắn sự kiện các Thẻ loại (Category cards)
  const categoryCards = document.querySelectorAll('.category-grid .category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', function(e) {
      e.preventDefault();
      const catTitle = card.querySelector('h3')?.textContent.trim();
      if (catTitle && catTitle !== 'Món ăn kèm') {
        currentCategory = catTitle;
        currentPage = 1;

        // Cập nhật chip tương ứng
        const allChips = document.querySelectorAll('.product-toolbar .chips .chip');
        allChips.forEach(c => {
          if (c.textContent.trim() === catTitle) {
            c.classList.add('is-active');
          } else {
            c.classList.remove('is-active');
          }
        });

        renderShopProducts();
        const pEl = document.getElementById('products');
        if (pEl) pEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // 3. Sắp xếp dropdown
  const sortSelect = document.querySelector('.results-row select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function(e) {
      const val = e.target.value;
      if (val === 'Giá thấp đến cao') currentSort = 'asc';
      else if (val === 'Giá cao đến thấp') currentSort = 'desc';
      else currentSort = 'popular';
      currentPage = 1;
      renderShopProducts();
    });
  }

  // 4. Nút "Bộ lọc" trên toolbar -> chuyển sang tìm kiếm nâng cao
  const filterBtn = document.querySelector('.product-toolbar .filter-button');
  if (filterBtn) {
    filterBtn.addEventListener('click', function() {
      if (typeof showSection === 'function') {
        showSection('section-search');
      }
    });
  }

  // 5. Khởi tạo tìm kiếm nâng cao
  initAdvancedSearch();

  // 6. Render ban đầu
  renderShopProducts();
});
