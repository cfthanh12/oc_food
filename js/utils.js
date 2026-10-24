/**
 * utils.js — Định dạng tiền/ngày, phân trang, validate, modal, toast
 * Dự án Web Bán Ốc — Ốc Xanh
 */

// Định dạng tiền tệ tiếng Việt: 280000 -> "280.000đ"
function formatMoney(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '0đ';
  return Number(amount).toLocaleString('vi-VN') + 'đ';
}

// Định dạng ngày: "DD/MM/YYYY"
function formatDate(dateInput) {
  if (!dateInput) return '';
  if (typeof dateInput === 'string' && dateInput.includes('/')) return dateInput;
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Chuyển đổi chuỗi ngày DD/MM/YYYY hoặc YYYY-MM-DD thành Date object (00:00:00)
function parseDateString(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
  }
  const str = String(dateInput).trim();
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  } else if (str.includes('-')) {
    const parts = str.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Kiểm tra xem ngày có nằm trong khoảng từ fromStr đến toStr hay không
function isDateInRange(dateInput, fromStr, toStr) {
  const d = parseDateString(dateInput);
  if (!d) return true;
  const time = d.getTime();

  if (fromStr) {
    const fromD = parseDateString(fromStr);
    if (fromD && time < fromD.getTime()) return false;
  }
  if (toStr) {
    const toD = parseDateString(toStr);
    if (toD && time > toD.getTime()) return false;
  }
  return true;
}

// Phân trang mảng
function paginate(array, page = 1, perPage = 8) {
  const totalItems = array.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalItems);
  const items = array.slice(startIndex, endIndex);

  return {
    items,
    totalPages,
    currentPage,
    totalItems,
    startIndex,
    endIndex
  };
}

// Hiển thị thông báo Toast
let toastTimer = null;
function showToast(message, type = 'success') {
  let toastEl = document.getElementById('toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.className = 'toast';
    toastEl.setAttribute('role', 'status');
    document.body.appendChild(toastEl);
  }

  // Icon SVG
  const checkIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>`;
  const warnIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;

  const icon = type === 'warning' || type === 'danger' ? warnIcon : checkIcon;
  toastEl.innerHTML = `${icon}<span>${message}</span>`;
  toastEl.classList.add('is-open');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    hideToast();
  }, 3000);
}

function hideToast() {
  const toastEl = document.getElementById('toast');
  if (toastEl) {
    toastEl.classList.remove('is-open');
  }
}

// Quản lý Modal
function openModal(modalId) {
  const modalEl = document.getElementById(modalId);
  if (!modalEl) return;
  modalEl.classList.add('is-open');

  // Đóng khi click ra vùng nền mờ
  modalEl.onclick = function(e) {
    if (e.target === modalEl) {
      closeModal(modalId);
    }
  };

  // Gắn sự kiện nút đóng (X)
  const closeBtn = modalEl.querySelector('.modal-close, .btn-secondary');
  if (closeBtn) {
    closeBtn.onclick = function() {
      closeModal(modalId);
    };
  }
}

function closeModal(modalId) {
  const modalEl = document.getElementById(modalId);
  if (modalEl) {
    modalEl.classList.remove('is-open');
  }
}

// Đóng modal khi bấm phím ESC
window.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.overlay.is-open');
    openModals.forEach(m => m.classList.remove('is-open'));
  }
});

// Modal xác nhận chung (Confirm Modal)
function openConfirmModal(title, message, onConfirm) {
  let confirmEl = document.getElementById('modal-confirm');
  if (!confirmEl) return;

  const titleEl = confirmEl.querySelector('h2');
  const msgEl = confirmEl.querySelector('p');
  const confirmBtn = confirmEl.querySelector('.btn-danger, .btn-primary');
  const cancelBtn = confirmEl.querySelector('.btn-secondary');

  if (titleEl) titleEl.textContent = title || 'Xác nhận';
  if (msgEl) msgEl.textContent = message || 'Bạn có chắc chắn muốn thực hiện hành động này?';

  openModal('modal-confirm');

  if (confirmBtn) {
    // Xóa listener cũ bằng cách clone node
    const newBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);
    newBtn.onclick = function() {
      closeModal('modal-confirm');
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  if (cancelBtn) {
    cancelBtn.onclick = function() {
      closeModal('modal-confirm');
    };
  }
}

// Kiểm tra tính hợp lệ biểu mẫu (Form validation)
function validate(formElement) {
  let isValid = true;
  const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');

  inputs.forEach(input => {
    const field = input.closest('.field') || input.parentElement;
    let errorEl = field.querySelector('.field-error');

    // Xóa lỗi cũ
    field.classList.remove('has-error');
    if (errorEl) errorEl.remove();

    const value = input.value.trim();

    if (!value) {
      isValid = false;
      field.classList.add('has-error');
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.textContent = 'Vui lòng không để trống trường này';
      field.appendChild(errorEl);
    } else if (input.type === 'password' && input.minLength && value.length < input.minLength) {
      isValid = false;
      field.classList.add('has-error');
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.textContent = `Mật khẩu phải có ít nhất ${input.minLength} ký tự`;
      field.appendChild(errorEl);
    } else if (input.type === 'tel' && !/^[0-9+() -]{9,15}$/.test(value)) {
      isValid = false;
      field.classList.add('has-error');
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.textContent = 'Số điện thoại không hợp lệ';
      field.appendChild(errorEl);
    }
  });

  return isValid;
}
