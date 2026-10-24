/**
 * admin-categories.js — Quản lý loại sản phẩm (Admin)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let categorySearchKeyword = '';
let editingCategoryId = null;

function renderCategoryTable() {
  const tbody = document.querySelector('#section-categories tbody');
  if (!tbody) return;

  let categories = getCategories();
  const products = getProducts();

  if (categorySearchKeyword) {
    const kw = categorySearchKeyword.toLowerCase();
    categories = categories.filter(c =>
      c.name.toLowerCase().includes(kw) ||
      c.id.toLowerCase().includes(kw)
    );
  }

  if (categories.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Chưa có loại sản phẩm nào phù hợp.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  categories.forEach(c => {
    // Đếm số sản phẩm thuộc loại này
    const count = products.filter(p => p.categoryId === c.id || p.category === c.name).length;
    const isHidden = c.isVisible === false;
    const toggleText = isHidden ? 'Hiện' : 'Ẩn';

    html += `
      <tr style="${isHidden ? 'opacity:0.6;' : ''}">
        <td><strong>${c.id}</strong></td>
        <td>
          ${c.name}
          ${isHidden ? '<span class="badge badge-neutral" style="margin-left:6px;">Đã ẩn</span>' : ''}
        </td>
        <td><span class="badge ${count > 0 ? 'badge-info' : 'badge-neutral'}">${count} sản phẩm</span></td>
        <td>
          <button class="btn-link" type="button" onclick="openCategoryModal('${c.id}')">Sửa</button>
          <button class="btn-link" style="margin-left:8px;" type="button" onclick="handleToggleCategoryVisibility('${c.id}')">${toggleText}</button>
          <button class="btn-link btn-link-danger" style="margin-left:8px;" type="button" onclick="handleDeleteCategory('${c.id}')">Xóa</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openCategoryModal(categoryId = null) {
  editingCategoryId = categoryId;
  let modalEl = document.getElementById('modal-edit-category');

  // Nếu chưa có modal category trong DOM thì tạo động
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-edit-category';
    modalEl.className = 'overlay';
    modalEl.innerHTML = `
      <section class="modal edit-modal" role="dialog" aria-modal="true" aria-label="Loại sản phẩm">
        <h2>${categoryId ? 'Chỉnh sửa loại sản phẩm' : 'Thêm loại sản phẩm'}</h2>
        <form id="form-edit-category">
          <div class="field">
            <label for="cat-name">Tên loại sản phẩm</label>
            <input class="input" id="cat-name" required placeholder="Ví dụ: Ốc nướng, Món ăn kèm...">
          </div>
          <div class="form-actions" style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
            <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-category')">Hủy</button>
            <button type="submit" class="btn btn-primary">Lưu loại</button>
          </div>
        </form>
      </section>
    `;
    document.body.appendChild(modalEl);

    const form = modalEl.querySelector('#form-edit-category');
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validate(form)) return;

      const nameVal = document.getElementById('cat-name').value.trim();
      if (!nameVal) return;

      if (editingCategoryId) {
        updateCategory(editingCategoryId, nameVal);
        showToast('Đã cập nhật loại sản phẩm');
      } else {
        addCategory(nameVal);
        showToast('Đã thêm loại sản phẩm mới');
      }

      closeModal('modal-edit-category');
      renderCategoryTable();
      if (typeof renderAdminProductTable === 'function') renderAdminProductTable();
    });
  }

  const h2El = modalEl.querySelector('h2');
  const inputEl = modalEl.querySelector('#cat-name');

  if (categoryId) {
    const cats = getCategories();
    const c = cats.find(item => item.id === categoryId);
    if (h2El) h2El.textContent = 'Chỉnh sửa loại sản phẩm';
    if (inputEl && c) inputEl.value = c.name;
  } else {
    if (h2El) h2El.textContent = 'Thêm loại sản phẩm mới';
    if (inputEl) inputEl.value = '';
  }

  openModal('modal-edit-category');
}

function handleToggleCategoryVisibility(categoryId) {
  const cats = getCategories();
  const c = cats.find(item => item.id === categoryId);
  if (!c) return;

  const action = c.isVisible === false ? 'hiển thị lại' : 'ẩn';
  openConfirmModal(
    `Xác nhận ${action} loại sản phẩm`,
    `Bạn có chắc chắn muốn ${action} loại "${c.name}"? Khi ẩn, loại này sẽ không xuất hiện trên thực đơn khách hàng.`,
    function() {
      toggleCategoryVisibility(categoryId);
      showToast(`Đã ${action} loại "${c.name}" thành công`);
      renderCategoryTable();
    }
  );
}

function handleDeleteCategory(categoryId) {
  const cats = getCategories();
  const c = cats.find(item => item.id === categoryId);
  if (!c) return;

  const products = getProducts();
  const inUseCount = products.filter(p => p.categoryId === categoryId || p.category === c.name).length;

  if (inUseCount > 0) {
    showToast(`Không thể xóa! Có ${inUseCount} sản phẩm đang thuộc loại "${c.name}".`, 'warning');
    return;
  }

  openConfirmModal(
    'Xác nhận xóa loại',
    `Bạn có chắc chắn muốn xóa loại sản phẩm "${c.name}"?`,
    function() {
      const res = deleteCategory(categoryId);
      if (res.success) {
        showToast(`Đã xóa loại ${c.name} thành công`);
        renderCategoryTable();
      } else {
        showToast(res.message, 'warning');
      }
    }
  );
}

// Gắn sự kiện
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.querySelector('#section-categories .btn-primary');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      openCategoryModal(null);
    });
  }

  const searchInput = document.querySelector('#section-categories .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      categorySearchKeyword = e.target.value.trim();
      renderCategoryTable();
    });
  }
});
