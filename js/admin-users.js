/**
 * admin-users.js — Quản lý người dùng (Admin)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let userSearchKeyword = '';

function renderUserTable() {
  const tbody = document.querySelector('#section-users tbody');
  if (!tbody) return;

  let users = getUsers();

  if (userSearchKeyword) {
    const kw = userSearchKeyword.toLowerCase();
    users = users.filter(u =>
      (u.username && u.username.toLowerCase().includes(kw)) ||
      (u.fullname && u.fullname.toLowerCase().includes(kw)) ||
      (u.email && u.email.toLowerCase().includes(kw)) ||
      (u.phone && u.phone.includes(kw))
    );
  }

  if (users.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không tìm thấy tài khoản người dùng phù hợp.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  users.forEach(u => {
    const isLocked = u.status === 'locked';
    const isAdminUser = u.role === 'admin';

    let actionBtn = '';
    if (isAdminUser) {
      actionBtn = `<span style="font-size:12px; color:var(--ink-500);">Mặc định</span>`;
    } else {
      const lockBtn = isLocked
        ? `<button class="btn-link" style="color:var(--color-primary); font-weight:700;" type="button" onclick="handleToggleLock('${u.id}', 'mở khóa')">Mở khóa</button>`
        : `<button class="btn-link" style="color:var(--danger-fg); font-weight:700;" type="button" onclick="handleToggleLock('${u.id}', 'khóa')">Khóa</button>`;
      
      const resetBtn = `<button class="btn-link" style="margin-left:8px; color:var(--ink-700);" type="button" onclick="handleResetPassword('${u.id}')">Reset MK</button>`;
      actionBtn = `${lockBtn} ${resetBtn}`;
    }

    html += `
      <tr>
        <td><strong>${u.username}</strong></td>
        <td>${u.fullname || u.username}</td>
        <td>${u.email || '—'}</td>
        <td>${u.phone || '—'}</td>
        <td><span class="badge ${isAdminUser ? 'badge-info' : 'badge-neutral'}">${isAdminUser ? 'Admin' : 'Khách hàng'}</span></td>
        <td><span class="badge ${isLocked ? 'badge-danger' : 'badge-success'}">${isLocked ? 'Bị khóa' : 'Hoạt động'}</span></td>
        <td>${actionBtn}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function handleResetPassword(userId) {
  const u = getUserById(userId);
  if (!u) return;

  openConfirmModal(
    'Xác nhận đặt lại mật khẩu',
    `Bạn có chắc chắn muốn đặt lại mật khẩu cho tài khoản "${u.username}" (${u.fullname || ''}) về mật khẩu mặc định "123456"?`,
    function() {
      const res = resetUserPassword(userId, '123456');
      if (res.success) {
        showToast(res.message);
        renderUserTable();
      } else {
        showToast(res.message, 'warning');
      }
    }
  );
}

function handleToggleLock(userId, actionText) {
  const u = getUserById(userId);
  if (!u) return;

  openConfirmModal(
    `Xác nhận ${actionText} tài khoản`,
    `Bạn có chắc chắn muốn ${actionText} tài khoản "${u.username}" (${u.fullname || ''}) không?`,
    function() {
      const res = toggleUserLock(userId);
      if (res.success) {
        showToast(`Đã ${actionText} tài khoản ${u.username} thành công`);
        renderUserTable();
        if (typeof updateAdminStats === 'function') updateAdminStats();
      } else {
        showToast(res.message, 'warning');
      }
    }
  );
}

// Gắn sự kiện ô tìm kiếm người dùng
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('#section-users .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      userSearchKeyword = e.target.value.trim();
      renderUserTable();
    });
  }
});
