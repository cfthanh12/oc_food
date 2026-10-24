/**
 * auth.js — Đăng ký, đăng nhập, đăng xuất, kiểm tra quyền
 * Dự án Web Bán Ốc — Ốc Xanh
 */

function register(fullname, username, phone, password) {
  if (!username || !password) {
    return { success: false, message: 'Vui lòng điền đầy đủ tên đăng nhập và mật khẩu.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự.' };
  }

  const existing = getUserByUsername(username);
  if (existing) {
    return { success: false, message: 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác.' };
  }

  const newUser = addUser({
    fullname: fullname || username,
    username: username,
    phone: phone || '',
    password: password,
    role: 'customer'
  });

  setCurrentUser(newUser);
  return { success: true, message: 'Đăng ký tài khoản thành công!', user: newUser };
}

function login(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu.' };
  }

  const user = getUserByUsername(username);
  if (!user) {
    return { success: false, message: 'Tài khoản không tồn tại trong hệ thống.' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Mật khẩu không chính xác.' };
  }

  if (user.status === 'locked') {
    return { success: false, message: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ cửa hàng.' };
  }

  setCurrentUser(user);
  return { success: true, message: 'Đăng nhập thành công!', user: user };
}

function adminLogin(username, password) {
  if (!username || !password) {
    return { success: false, message: 'Vui lòng nhập tên đăng nhập và mật khẩu quản trị.' };
  }

  const u = username.toLowerCase().trim();
  const p = password.trim();

  // Cho phép đăng nhập nếu là tài khoản admin với mật khẩu 123456 hoặc admin
  if (u === 'admin' && (p === '123456' || p === 'admin')) {
    let user = getUserByUsername('admin');
    if (!user) {
      user = {
        id: 'U001',
        username: 'admin',
        fullname: 'Quản trị viên',
        role: 'admin',
        status: 'active'
      };
    }
    setCurrentAdmin(user);
    return { success: true, message: 'Đăng nhập quản trị thành công!' };
  }

  const user = getUserByUsername(username);
  if (!user || user.role !== 'admin') {
    return { success: false, message: 'Tài khoản không có quyền truy cập khu vực quản trị.' };
  }

  if (user.password !== p && !(user.username === 'admin' && (p === '123456' || p === 'admin'))) {
    return { success: false, message: 'Mật khẩu quản trị không chính xác.' };
  }

  setCurrentAdmin(user);
  return { success: true, message: 'Đăng nhập quản trị thành công!' };
}

function logout() {
  clearCurrentUser();
  window.location.href = 'index.html';
}

function adminLogout() {
  clearCurrentAdmin();
  window.location.href = 'admin-login.html';
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function isAdmin() {
  const admin = getCurrentAdmin();
  return admin !== null && admin.role === 'admin';
}

// ==========================================================
// TỰ ĐỘNG GẮN SỰ KIỆN TRÊN TRANG LOGIN VÀ ADMIN-LOGIN
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
  // 1. TRANG LOGIN.HTML
  const authTabs = document.querySelector('.auth-tabs');
  if (authTabs) {
    const tabBtns = authTabs.querySelectorAll('button');
    const loginForm = document.querySelector('.login-form');
    const regForm = document.querySelector('.register-form');
    const headingEl = document.querySelector('.auth-card h1');
    const subTitleEl = document.querySelector('.auth-subtitle');

    if (tabBtns.length >= 2) {
      // Tab 1: Đăng nhập
      tabBtns[0].addEventListener('click', function() {
        tabBtns[0].classList.add('is-active');
        tabBtns[1].classList.remove('is-active');
        if (loginForm) loginForm.style.display = 'block';
        if (regForm) regForm.style.display = 'none';
        if (headingEl) headingEl.textContent = 'Chào mừng bạn trở lại';
        if (subTitleEl) subTitleEl.textContent = 'Đăng nhập để thưởng thức trọn vị biển xanh.';
      });

      // Tab 2: Đăng ký
      tabBtns[1].addEventListener('click', function() {
        tabBtns[1].classList.add('is-active');
        tabBtns[0].classList.remove('is-active');
        if (loginForm) loginForm.style.display = 'none';
        if (regForm) regForm.style.display = 'block';
        if (headingEl) headingEl.textContent = 'Tạo tài khoản mới';
        if (subTitleEl) subTitleEl.textContent = 'Đăng ký nhanh chóng, nhận nhiều ưu đãi tươi ngon.';
      });
    }

    // Submit Đăng nhập
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validate(loginForm)) return;

        const u = document.getElementById('login-username').value;
        const p = document.getElementById('login-password').value;
        const res = login(u, p);

        if (res.success) {
          showToast(res.message);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 600);
        } else {
          showToast(res.message, 'warning');
        }
      });
    }

    // Submit Đăng ký
    if (regForm) {
      regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!validate(regForm)) return;

        const fn = document.getElementById('reg-fullname').value;
        const u = document.getElementById('reg-email').value;
        const phone = document.getElementById('reg-phone').value;
        const p = document.getElementById('reg-password').value;

        const res = register(fn, u, phone, p);

        if (res.success) {
          showToast(res.message);
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 600);
        } else {
          showToast(res.message, 'warning');
        }
      });
    }
  }

  // 2. TRANG ADMIN-LOGIN.HTML
  const adminAuthForm = document.querySelector('.admin-auth .auth-form');
  if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!validate(adminAuthForm)) return;

      const u = document.getElementById('admin-username').value;
      const p = document.getElementById('admin-password').value;
      const res = adminLogin(u, p);

      if (res.success) {
        showToast(res.message);
        setTimeout(() => {
          window.location.href = 'admin.html';
        }, 600);
      } else {
        showToast(res.message, 'warning');
      }
    });
  }
});
