/**
 * admin-products.js — Quản lý sản phẩm (Admin: thêm, sửa, ẩn/hiện, tìm kiếm, phân trang)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let adminProductKeyword = '';
let adminProductPage = 1;
const ADMIN_PER_PAGE = 8;
let editingAdminProductId = null;

function renderAdminProductTable() {
  const tbody = document.querySelector('#section-products tbody');
  if (!tbody) return;

  let products = getProducts();

  if (adminProductKeyword) {
    const kw = adminProductKeyword.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(kw) ||
      p.id.toLowerCase().includes(kw) ||
      (p.category && p.category.toLowerCase().includes(kw))
    );
  }

  const pageData = paginate(products, adminProductPage, ADMIN_PER_PAGE);

  if (pageData.items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không tìm thấy sản phẩm nào.
        </td>
      </tr>
    `;
    renderAdminProductPagination(0, 1);
    return;
  }

  let html = '';
  pageData.items.forEach(p => {
    let badgeHtml = '';
    if (!p.isVisible) {
      badgeHtml = `<span class="badge badge-neutral">Đã ẩn</span>`;
    } else if (p.stock <= 0) {
      badgeHtml = `<span class="badge badge-danger">Hết hàng</span>`;
    } else if (p.stock < 6) {
      badgeHtml = `<span class="badge badge-warning">Sắp hết</span>`;
    } else {
      badgeHtml = `<span class="badge badge-success">Còn hàng</span>`;
    }

    const toggleText = p.isVisible ? 'Ẩn' : 'Hiện';

    html += `
      <tr style="${!p.isVisible ? 'opacity:0.6;' : ''}">
        <td class="table-product">
          <img src="${p.image}" alt="${p.name}" width="45" height="45" onerror="this.style.display='none'">
          <span>${p.name}<small>${p.id}</small></span>
        </td>
        <td>${p.category}</td>
        <td><strong>${formatMoney(p.price)}</strong></td>
        <td>${p.stock} ${p.unit || 'kg'}</td>
        <td>${badgeHtml}</td>
        <td>
          <button class="btn-link" type="button" onclick="openAdminProductModal('${p.id}')">Sửa</button>
          <button class="btn-link" type="button" style="margin-left:8px;" onclick="handleToggleVisibility('${p.id}')">${toggleText}</button>
          <button class="btn-link btn-link-danger" type="button" style="margin-left:8px;" onclick="handleDeleteProduct('${p.id}')">Xóa</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  renderAdminProductPagination(pageData.totalPages, pageData.currentPage);
}

function renderAdminProductPagination(totalPages, activePage) {
  const pagEl = document.querySelector('#section-products .pagination');
  if (!pagEl) return;

  if (totalPages <= 1) {
    pagEl.innerHTML = '';
    return;
  }

  let html = '';
  html += `<button type="button" class="page-btn page-arrow ${activePage === 1 ? 'is-disabled' : ''}" aria-label="Trang trước" ${activePage === 1 ? 'disabled' : ''} onclick="goToAdminProductPage(${activePage - 1})">&#8249;</button>`;

  for (let i = 1; i <= totalPages; i++) {
    html += `<button type="button" class="page-btn page-num ${activePage === i ? 'is-active' : ''}" onclick="goToAdminProductPage(${i})">${i}</button>`;
  }

  html += `<button type="button" class="page-btn page-arrow ${activePage === totalPages ? 'is-disabled' : ''}" aria-label="Trang sau" ${activePage === totalPages ? 'disabled' : ''} onclick="goToAdminProductPage(${activePage + 1})">&#8250;</button>`;

  pagEl.innerHTML = html;
}

function goToAdminProductPage(page) {
  adminProductPage = page;
  renderAdminProductTable();
}

function handleToggleVisibility(productId) {
  const p = getProductById(productId);
  if (!p) return;

  const action = p.isVisible ? 'ẩn' : 'hiển thị lại';
  openConfirmModal(
    `Xác nhận ${action} sản phẩm`,
    `Bạn có chắc chắn muốn ${action} sản phẩm "${p.name}" trên cửa hàng không?`,
    function() {
      toggleProductVisibility(productId);
      showToast(`Đã ${action} sản phẩm thành công`);
      renderAdminProductTable();
      if (typeof updateAdminStats === 'function') updateAdminStats();
    }
  );
}

function handleDeleteProduct(productId) {
  const p = getProductById(productId);
  if (!p) return;

  openConfirmModal(
    'Xác nhận xóa sản phẩm',
    `Bạn có chắc chắn muốn xóa sản phẩm "${p.name}" (${p.id})? Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi cửa hàng.`,
    function() {
      const res = deleteProduct(productId);
      if (res.success) {
        showToast(`Đã xóa sản phẩm "${p.name}" thành công`);
        renderAdminProductTable();
        if (typeof renderPricingTable === 'function') renderPricingTable();
        if (typeof renderStockTable === 'function') renderStockTable();
        if (typeof updateAdminStats === 'function') updateAdminStats();
      } else {
        showToast(res.message, 'warning');
      }
    }
  );
}

// Modal Thêm / Chỉnh sửa sản phẩm
function openAdminProductModal(productId = null) {
  editingAdminProductId = productId;
  const modalEl = document.getElementById('modal-edit-product');
  if (!modalEl) return;

  const h2El = modalEl.querySelector('h2');
  const idInput = document.getElementById('edit-id');
  const nameInput = document.getElementById('edit-name');
  const catSelect = document.getElementById('edit-category');
  const unitInput = document.getElementById('edit-unit');
  const priceInput = document.getElementById('edit-price');
  const stockInput = document.getElementById('edit-stock');
  const imageInput = document.getElementById('edit-image');
  const descInput = document.getElementById('edit-description');

  // Nạp danh sách category vào select
  if (catSelect) {
    const categories = getCategories();
    catSelect.innerHTML = categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  }

  if (productId) {
    const p = getProductById(productId);
    if (!p) return;
    if (h2El) h2El.textContent = 'Chỉnh sửa sản phẩm';
    if (idInput) {
      idInput.value = p.id;
      idInput.disabled = true;
    }
    if (nameInput) nameInput.value = p.name;
    if (catSelect) catSelect.value = p.category;
    if (unitInput) unitInput.value = p.unit || 'kg';
    if (priceInput) priceInput.value = p.price;
    if (stockInput) stockInput.value = p.stock;
    if (imageInput) imageInput.value = p.image || '';
    if (descInput) descInput.value = p.description || '';
  } else {
    if (h2El) h2El.textContent = 'Thêm sản phẩm mới';
    if (idInput) {
      idInput.value = '';
      idInput.disabled = false;
    }
    if (nameInput) nameInput.value = '';
    if (unitInput) unitInput.value = 'kg';
    if (priceInput) priceInput.value = '';
    if (stockInput) stockInput.value = '';
    if (imageInput) imageInput.value = '';
    if (descInput) descInput.value = '';
  }

  openModal('modal-edit-product');
}

// Gắn sự kiện trang quản lý sản phẩm
document.addEventListener('DOMContentLoaded', function() {
  // Nút "Thêm sản phẩm"
  const addBtn = document.querySelector('#section-products .btn-primary');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openAdminProductModal(null);
    });
  }

  // Ô tìm kiếm sản phẩm
  const searchInput = document.querySelector('#section-products .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      adminProductKeyword = e.target.value.trim();
      adminProductPage = 1;
      renderAdminProductTable();
    });
  }

  // Xử lý submit form modal sản phẩm
  const modalEl = document.getElementById('modal-edit-product');
  if (modalEl) {
    const form = modalEl.querySelector('form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validate(form)) return;

        const idVal = document.getElementById('edit-id') ? document.getElementById('edit-id').value.trim() : '';
        const name = document.getElementById('edit-name').value.trim();
        const cat = document.getElementById('edit-category').value;
        const unit = document.getElementById('edit-unit') ? document.getElementById('edit-unit').value.trim() || 'kg' : 'kg';
        const price = Number(document.getElementById('edit-price').value) || 0;
        const stock = Number(document.getElementById('edit-stock').value) || 0;
        const image = document.getElementById('edit-image') ? document.getElementById('edit-image').value.trim() || 'images/products/oc-huong.jpg' : 'images/products/oc-huong.jpg';
        const desc = document.getElementById('edit-description') ? document.getElementById('edit-description').value.trim() : '';

        // Tìm categoryId tương ứng
        const categories = getCategories();
        const foundCat = categories.find(c => c.name === cat);
        const catId = foundCat ? foundCat.id : 'LOAI01';

        if (editingAdminProductId) {
          updateProduct(editingAdminProductId, {
            name: name,
            category: cat,
            categoryId: catId,
            unit: unit,
            price: price,
            stock: stock,
            image: image,
            description: desc
          });
          showToast('Đã lưu chỉnh sửa sản phẩm');
        } else {
          addProduct({
            id: idVal || undefined,
            name: name,
            category: cat,
            categoryId: catId,
            unit: unit,
            price: price,
            stock: stock,
            image: image,
            description: desc
          });
          showToast('Đã thêm sản phẩm mới thành công');
        }

        closeModal('modal-edit-product');
        renderAdminProductTable();
        if (typeof renderPricingTable === 'function') renderPricingTable();
        if (typeof renderStockTable === 'function') renderStockTable();
        if (typeof updateAdminStats === 'function') updateAdminStats();
      });
    }

    // Nút Hủy trong modal
    const cancelBtn = modalEl.querySelector('.btn-secondary');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', function() {
        closeModal('modal-edit-product');
      });
    }
  }
});
