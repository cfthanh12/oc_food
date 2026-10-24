/**
 * shop-account.js — Thông tin cá nhân, lịch sử đơn hàng
 * Dự án Web Bán Ốc — Ốc Xanh
 */

// Render và quản lý trang thông tin cá nhân (#section-profile)
function renderProfile() {
  const form = document.querySelector('#section-profile form');
  if (!form) return;

  const curUser = getCurrentUser();
  if (!curUser) {
    showToast('Vui lòng đăng nhập để xem thông tin cá nhân', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 600);
    return;
  }

  const nameInput = document.getElementById('pf-name');
  const emailInput = document.getElementById('pf-email');
  const phoneInput = document.getElementById('pf-phone');
  const addrInput = document.getElementById('pf-address');

  if (nameInput) nameInput.value = curUser.fullname || curUser.username;
  if (emailInput) emailInput.value = curUser.email || '';
  if (phoneInput) phoneInput.value = curUser.phone || '';
  if (addrInput) addrInput.value = curUser.address || '';
}

// Render lịch sử đơn hàng của tôi (#section-orders)
function renderOrderHistory() {
  const tbody = document.querySelector('#section-orders tbody');
  if (!tbody) return;

  const curUser = getCurrentUser();
  const allOrders = getOrders();

  // Lọc đơn theo tài khoản hiện tại, nếu chưa đăng nhập thì hiện toàn bộ mẫu
  let userOrders = curUser
    ? allOrders.filter(o => o.userId === curUser.id || o.customer === curUser.fullname || o.customer === curUser.username)
    : allOrders;

  if (userOrders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding: 40px 16px; color:var(--ink-500);">
          Bạn chưa có đơn hàng nào. Hãy khám phá và đặt món ốc ngay hôm nay!
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  userOrders.forEach(o => {
    let badgeClass = 'badge-info';
    if (o.status === 'Đã xử lý') badgeClass = 'badge-warning';
    else if (o.status === 'Đã giao') badgeClass = 'badge-success';
    else if (o.status === 'Hủy') badgeClass = 'badge-danger';

    html += `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>${formatDate(o.date)}</td>
        <td><strong>${formatMoney(o.total)}</strong></td>
        <td><span class="badge ${badgeClass}">${o.status}</span></td>
        <td>
          <button class="btn btn-ghost" type="button" onclick="viewClientOrderDetail('${o.id}')">Xem</button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// Xem chi tiết đơn hàng cho khách hàng
function viewClientOrderDetail(orderId) {
  const o = getOrderById(orderId);
  if (!o) return;

  let itemsHtml = '';
  o.items.forEach(i => {
    itemsHtml += `
      <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">
        <span>${i.name} × ${i.quantity} ${i.unit || ''}</span>
        <strong>${formatMoney(i.price * i.quantity)}</strong>
      </div>
    `;
  });

  const content = `
    <div style="padding:8px 0;">
      <p style="margin-bottom:8px;"><strong>Mã đơn hàng:</strong> #${o.id} <span class="badge badge-info">${o.status}</span></p>
      <p style="margin-bottom:8px;"><strong>Ngày đặt:</strong> ${formatDate(o.date)}</p>
      <p style="margin-bottom:8px;"><strong>Khách hàng:</strong> ${o.customer} (${o.phone || 'Chưa có SĐT'})</p>
      <p style="margin-bottom:12px;"><strong>Địa chỉ:</strong> ${o.address}</p>
      <p style="margin-bottom:12px;"><strong>Thanh toán:</strong> ${o.payment}</p>
      <div style="margin:16px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:10px 0;">
        ${itemsHtml}
      </div>
      <div class="total" style="display:flex; justify-content:space-between; font-size:18px;">
        <span>Tổng thanh toán:</span>
        <strong style="color:var(--color-primary);">${formatMoney(o.total)}</strong>
      </div>
    </div>
  `;

  // Dùng modal confirm làm modal xem chi tiết hoặc hiển thị
  let confirmEl = document.getElementById('modal-confirm');
  if (confirmEl) {
    const titleEl = confirmEl.querySelector('h2');
    const msgEl = confirmEl.querySelector('p');
    const confirmBtn = confirmEl.querySelector('.btn-danger, .btn-primary');
    const cancelBtn = confirmEl.querySelector('.btn-secondary');

    if (titleEl) titleEl.textContent = `Chi tiết đơn hàng #${o.id}`;
    if (msgEl) msgEl.innerHTML = content;

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
  } else {
    alert(`Đơn hàng #${o.id}\nTổng tiền: ${formatMoney(o.total)}\nTrạng thái: ${o.status}`);
  }
}

// Gắn sự kiện khi DOM load
document.addEventListener('DOMContentLoaded', function() {
  const profileForm = document.querySelector('#section-profile form');
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validate(profileForm)) return;

      const curUser = getCurrentUser();
      if (!curUser) return;

      const name = document.getElementById('pf-name').value.trim();
      const email = document.getElementById('pf-email').value.trim();
      const phone = document.getElementById('pf-phone').value.trim();
      const address = document.getElementById('pf-address').value.trim();

      const updated = updateUser(curUser.id, {
        fullname: name,
        email: email,
        phone: phone,
        address: address
      });

      if (updated) {
        showToast('Đã lưu thông tin cá nhân');
        if (typeof updateHeaderAccount === 'function') {
          updateHeaderAccount();
        }
      }
    });
  }
});
