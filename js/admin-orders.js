/**
 * admin-orders.js — Quản lý đơn hàng (Admin: xem, lọc theo ngày/trạng thái, cập nhật trạng thái chi tiết)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let orderSearchKeyword = '';
let orderStatusFilter = 'Tất cả';
let orderDateFrom = '';
let orderDateTo = '';

function renderOrderTable() {
  const tbody = document.querySelector('#section-orders tbody');
  if (!tbody) return;

  let orders = getOrders();

  // 1. Lọc theo khoảng ngày đặt
  if (orderDateFrom || orderDateTo) {
    orders = orders.filter(o => isDateInRange(o.date, orderDateFrom, orderDateTo));
  }

  // 2. Lọc theo trạng thái
  if (orderStatusFilter !== 'Tất cả') {
    orders = orders.filter(o => o.status === orderStatusFilter);
  }

  // 3. Lọc theo từ khóa tìm kiếm
  if (orderSearchKeyword) {
    const kw = orderSearchKeyword.toLowerCase();
    orders = orders.filter(o =>
      o.id.toLowerCase().includes(kw) ||
      o.customer.toLowerCase().includes(kw) ||
      (o.phone && o.phone.includes(kw)) ||
      (o.address && o.address.toLowerCase().includes(kw))
    );
  }

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không có đơn hàng nào phù hợp với bộ lọc ngày và trạng thái.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  orders.forEach(o => {
    let badgeClass = 'badge-info';
    if (o.status === 'Đã xử lý') badgeClass = 'badge-warning';
    else if (o.status === 'Đã giao') badgeClass = 'badge-success';
    else if (o.status === 'Hủy') badgeClass = 'badge-danger';

    let nextActionBtn = '';
    if (o.status === 'Mới đặt') {
      nextActionBtn = `<button class="btn-link" style="color:var(--color-primary); font-weight:700; margin-left:6px;" type="button" onclick="handleAdvanceOrderStatus('${o.id}', 'Đã xử lý')">Xử lý</button>`;
    } else if (o.status === 'Đã xử lý') {
      nextActionBtn = `<button class="btn-link" style="color:var(--success-fg); font-weight:700; margin-left:6px;" type="button" onclick="handleAdvanceOrderStatus('${o.id}', 'Đã giao')">Giao</button>`;
    }

    let cancelBtn = '';
    if (o.status === 'Mới đặt' || o.status === 'Đã xử lý') {
      cancelBtn = `<button class="btn-link btn-link-danger" style="margin-left:6px;" type="button" onclick="handleCancelOrder('${o.id}')">Hủy</button>`;
    }

    html += `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${o.customer}</td>
        <td>${formatDate(o.date)}</td>
        <td>${o.address}</td>
        <td><strong>${formatMoney(o.total)}</strong></td>
        <td><small>${o.payment || 'Tiền mặt'}</small></td>
        <td><span class="badge ${badgeClass}">${o.status}</span></td>
        <td>
          <button class="btn-link" type="button" onclick="viewAdminOrderDetail('${o.id}')">Xem / Cập nhật</button>
          ${nextActionBtn}
          ${cancelBtn}
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function handleAdvanceOrderStatus(orderId, newStatus) {
  openConfirmModal(
    `Cập nhật trạng thái đơn #${orderId}`,
    `Chuyển trạng thái đơn hàng #${orderId} sang "${newStatus}"?`,
    function() {
      updateOrderStatus(orderId, newStatus);
      showToast(`Đơn hàng #${orderId} đã chuyển sang "${newStatus}"`);
      renderOrderTable();
      if (typeof updateAdminStats === 'function') updateAdminStats();
    }
  );
}

function handleCancelOrder(orderId) {
  openConfirmModal(
    `Hủy đơn hàng #${orderId}`,
    `Bạn có chắc chắn muốn hủy đơn hàng #${orderId}? Thao tác này sẽ hoàn trả số lượng vào tồn kho nếu cần.`,
    function() {
      const o = getOrderById(orderId);
      if (o && o.status !== 'Hủy') {
        // Hoàn lại tồn kho
        const products = getProducts();
        (o.items || []).forEach(item => {
          const p = products.find(prod => prod.id === item.productId || prod.name === item.name);
          if (p) {
            p.stock += Number(item.quantity);
            p.status = p.stock === 0 ? 'Hết hàng' : p.stock < 6 ? 'Sắp hết' : 'Còn hàng';
          }
        });
        saveProducts(products);
      }

      updateOrderStatus(orderId, 'Hủy');
      showToast(`Đã hủy đơn hàng #${orderId}`, 'warning');
      renderOrderTable();
      if (typeof updateAdminStats === 'function') updateAdminStats();
      if (typeof renderStockTable === 'function') renderStockTable();
    }
  );
}

// Cập nhật trạng thái trực tiếp từ Modal xem chi tiết
function changeOrderStatusFromDetail(orderId) {
  const selectEl = document.getElementById('detail-order-status');
  if (!selectEl) return;

  const newStatus = selectEl.value;
  const o = getOrderById(orderId);
  if (!o) return;

  if (o.status === newStatus) {
    showToast('Trạng thái không thay đổi');
    return;
  }

  if (newStatus === 'Hủy' && o.status !== 'Hủy') {
    handleCancelOrder(orderId);
    closeModal('modal-confirm');
    return;
  }

  updateOrderStatus(orderId, newStatus);
  showToast(`Đã cập nhật trạng thái đơn #${orderId} thành "${newStatus}"`);
  closeModal('modal-confirm');
  renderOrderTable();
  if (typeof updateAdminStats === 'function') updateAdminStats();
}

// Xem chi tiết đơn hàng quản trị + Cập nhật tình trạng
function viewAdminOrderDetail(orderId) {
  const o = getOrderById(orderId);
  if (!o) return;

  let itemsHtml = '';
  (o.items || []).forEach((item, idx) => {
    itemsHtml += `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${item.name}</strong></td>
        <td style="text-align:right;">${item.quantity} ${item.unit || ''}</td>
        <td style="text-align:right;">${formatMoney(item.price)}</td>
        <td style="text-align:right;"><strong>${formatMoney(item.price * item.quantity)}</strong></td>
      </tr>
    `;
  });

  let badgeClass = 'badge-info';
  if (o.status === 'Đã xử lý') badgeClass = 'badge-warning';
  else if (o.status === 'Đã giao') badgeClass = 'badge-success';
  else if (o.status === 'Hủy') badgeClass = 'badge-danger';

  const detailContent = `
    <div style="padding:8px 0;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span style="font-size:16px;">Mã đơn: <strong>#${o.id}</strong></span>
        <span class="badge ${badgeClass}">${o.status}</span>
      </div>
      
      <p style="margin-bottom:6px;"><strong>Khách hàng:</strong> ${o.customer}</p>
      <p style="margin-bottom:6px;"><strong>Số điện thoại:</strong> ${o.phone || 'Chưa cung cấp'}</p>
      <p style="margin-bottom:6px;"><strong>Địa chỉ giao:</strong> ${o.address}</p>
      <p style="margin-bottom:6px;"><strong>Ngày đặt:</strong> ${formatDate(o.date)}</p>
      <p style="margin-bottom:6px;"><strong>Hình thức thanh toán:</strong> ${o.payment}</p>
      ${o.note ? `<p style="margin-bottom:12px;"><strong>Ghi chú:</strong> ${o.note}</p>` : ''}

      <div class="table-scroll" style="margin:16px 0; max-height:220px;">
        <table class="table" style="font-size:13px;">
          <thead>
            <tr>
              <th>#</th>
              <th>Món ốc</th>
              <th style="text-align:right;">Số lượng</th>
              <th style="text-align:right;">Đơn giá</th>
              <th style="text-align:right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </div>

      <div class="total" style="display:flex; justify-content:space-between; font-size:18px; margin-bottom:16px;">
        <span>Tổng thanh toán:</span>
        <strong style="color:var(--color-primary);">${formatMoney(o.total)}</strong>
      </div>

      <div style="display:flex; align-items:center; gap:10px; padding:12px 14px; background:var(--blue-50); border-radius:8px; flex-wrap:wrap;">
        <label for="detail-order-status" style="font-weight:700; color:var(--ink-800); font-size:13px;">Tình trạng đơn:</label>
        <select class="select" id="detail-order-status" style="width:160px; min-height:36px; padding:0 8px;">
          <option value="Mới đặt" ${o.status === 'Mới đặt' ? 'selected' : ''}>Mới đặt</option>
          <option value="Đã xử lý" ${o.status === 'Đã xử lý' ? 'selected' : ''}>Đã xử lý</option>
          <option value="Đã giao" ${o.status === 'Đã giao' ? 'selected' : ''}>Đã giao</option>
          <option value="Hủy" ${o.status === 'Hủy' ? 'selected' : ''}>Hủy</option>
        </select>
        <button type="button" class="btn btn-primary" style="min-height:36px; padding:0 14px; font-size:13px;" onclick="changeOrderStatusFromDetail('${o.id}')">
          Cập nhật tình trạng
        </button>
      </div>
    </div>
  `;

  let confirmEl = document.getElementById('modal-confirm');
  if (confirmEl) {
    const titleEl = confirmEl.querySelector('h2');
    const msgEl = confirmEl.querySelector('p');
    const confirmBtn = confirmEl.querySelector('.btn-danger, .btn-primary');
    const cancelBtn = confirmEl.querySelector('.btn-secondary');

    if (titleEl) titleEl.textContent = `Chi tiết đơn hàng #${o.id}`;
    if (msgEl) msgEl.innerHTML = detailContent;

    if (confirmBtn) confirmBtn.style.display = 'none';
    if (cancelBtn) {
      cancelBtn.textContent = 'Đóng';
      cancelBtn.onclick = function() {
        closeModal('modal-confirm');
        if (confirmBtn) confirmBtn.style.display = 'inline-flex';
        cancelBtn.textContent = 'Hủy';
      };
    }

    openModal('modal-confirm');
  }
}

// Gắn sự kiện trang đơn hàng
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#section-orders .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      orderSearchKeyword = e.target.value.trim();
      renderOrderTable();
    });
  }

  const statusSelect = document.getElementById('filter-order-status');
  if (statusSelect) {
    statusSelect.addEventListener('change', function(e) {
      orderStatusFilter = e.target.value;
      renderOrderTable();
    });
  }

  const fromDateInput = document.getElementById('filter-order-from');
  if (fromDateInput) {
    fromDateInput.addEventListener('change', function(e) {
      orderDateFrom = e.target.value;
      renderOrderTable();
    });
  }

  const toDateInput = document.getElementById('filter-order-to');
  if (toDateInput) {
    toDateInput.addEventListener('change', function(e) {
      orderDateTo = e.target.value;
      renderOrderTable();
    });
  }

  const clearBtn = document.getElementById('btn-clear-order-filter');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      orderSearchKeyword = '';
      orderStatusFilter = 'Tất cả';
      orderDateFrom = '';
      orderDateTo = '';
      if (searchInput) searchInput.value = '';
      if (statusSelect) statusSelect.value = 'Tất cả';
      if (fromDateInput) fromDateInput.value = '';
      if (toDateInput) toDateInput.value = '';
      renderOrderTable();
    });
  }
});
