/**
 * shop.js — Điều khiển chung trang khách (chuyển section, menu, header, dropdown)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

// Đặt liên kết active duy nhất trên header
function setActiveNav(targetHref) {
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === targetHref) {
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });
}

// Chuyển đổi giữa các section trong trang index.html
function showSection(sectionId, targetNavHref) {
  const sections = document.querySelectorAll('.shop-section');
  sections.forEach(sec => sec.classList.remove('is-active'));

  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('is-active');
  }

  // Cập nhật trạng thái menu chính xác (chỉ 1 link duy nhất được active)
  if (targetNavHref) {
    setActiveNav(targetNavHref);
  } else if (sectionId === 'section-home') {
    setActiveNav('#');
  } else if (sectionId === 'section-search') {
    setActiveNav('#advanced-search');
  } else {
    // Các trang khác (profile, orders, checkout): xóa active menu
    setActiveNav('');
  }

  // Đóng mobile menu nếu đang mở
  const mainNav = document.querySelector('.main-nav');
  if (mainNav) mainNav.classList.remove('mobile-open');

  // Đóng dropdown tài khoản
  closeAccountDropdown();

  // Chỉ cuộn lên đầu nếu không phải đang chuyển đến vị trí cụ thể (như sản phẩm)
  if (targetNavHref !== '#products') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Cập nhật giao diện tài khoản trên header
function updateHeaderAccount() {
  const accountContainer = document.querySelector('.header .account');
  if (!accountContainer) return;

  const currentUser = getCurrentUser();

  if (currentUser) {
    accountContainer.innerHTML = `
      <button class="account-button" id="btn-account-toggle" type="button" aria-expanded="false">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"/>
        </svg>
        <span>${currentUser.fullname || currentUser.username}</span>
      </button>
      <div class="account-dropdown" id="account-dropdown">
        <button type="button" id="btn-nav-profile">Thông tin cá nhân</button>
        <button type="button" id="btn-nav-orders">Đơn hàng của tôi</button>
        <button type="button" id="btn-nav-logout" style="color:var(--danger-fg)">Đăng xuất</button>
      </div>
    `;

    const toggleBtn = document.getElementById('btn-account-toggle');
    const dropdown = document.getElementById('account-dropdown');

    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('is-open');
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    document.getElementById('btn-nav-profile').addEventListener('click', function() {
      showSection('section-profile');
      if (typeof renderProfile === 'function') renderProfile();
    });

    document.getElementById('btn-nav-orders').addEventListener('click', function() {
      showSection('section-orders');
      if (typeof renderOrderHistory === 'function') renderOrderHistory();
    });

    document.getElementById('btn-nav-logout').addEventListener('click', function() {
      logout();
    });
  } else {
    accountContainer.innerHTML = `
      <a href="login.html" class="account-button">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0"/>
        </svg>
        <span>Đăng nhập</span>
      </a>
    `;
  }
}

function closeAccountDropdown() {
  const dropdown = document.getElementById('account-dropdown');
  if (dropdown) dropdown.classList.remove('is-open');
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', function() {
  // Chỉ chạy trên các trang có header của shop (index.html)
  if (!document.querySelector('.shop-section')) return;

  // Cập nhật header account
  updateHeaderAccount();

  // Đóng dropdown khi click ra ngoài
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.account')) {
      closeAccountDropdown();
    }
  });

  // Mobile menu hamburger
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      mainNav.classList.toggle('mobile-open');
    });
  }

  // Điều hướng từ menu chính
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (href === '#' || href === '#home') {
        e.preventDefault();
        showSection('section-home', '#');
      } else if (href === '#products') {
        e.preventDefault();
        showSection('section-home', '#products');
        const pEl = document.getElementById('products');
        if (pEl) {
          pEl.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (href === '#advanced-search') {
        e.preventDefault();
        showSection('section-search', '#advanced-search');
      }
    });
  });

  // Hero CTA button
  const heroCta = document.querySelector('.hero-cta');
  if (heroCta) {
    heroCta.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('section-home', '#products');
      const pEl = document.getElementById('products');
      if (pEl) pEl.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Footer links
  const footerLinks = document.querySelectorAll('.footer a');
  footerLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#products') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('section-home', '#products');
        const pEl = document.getElementById('products');
        if (pEl) pEl.scrollIntoView({ behavior: 'smooth' });
      });
    } else if (href === '#advanced-search') {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        showSection('section-search', '#advanced-search');
      });
    }
  });

  // Quick search in header
  const quickSearchInput = document.querySelector('.quick-search input');
  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', function(e) {
      const kw = e.target.value.trim();
      if (typeof window.filterProductsByKeyword === 'function') {
        showSection('section-home');
        window.filterProductsByKeyword(kw);
      }
    });

    quickSearchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        showSection('section-home');
        const pEl = document.getElementById('products');
        if (pEl) pEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
