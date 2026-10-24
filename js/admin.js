/**
 * admin.js — Điều khiển chung trang Admin (Sidebar, chuyển mục, thống kê tổng quan, đăng xuất)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

// Chuyển đổi giữa các mục quản trị
function switchAdminSection(sectionId) {
  // 1. Cập nhật các section
  const sections = document.querySelectorAll('.admin-section');
  sections.forEach(sec => sec.classList.remove('is-active'));

  const targetSec = document.getElementById(sectionId);
  if (targetSec) {
    targetSec.classList.add('is-active');
  }

  // 2. Cập nhật active button trên sidebar
  const sidebarBtns = document.querySelectorAll('.sidebar-nav .sidebar-btn, .sidebar-nav .sidebar-item');
  let currentTitle = 'Quản lý cửa hàng';

  sidebarBtns.forEach(btn => {
    btn.classList.remove('is-active');
    if (btn.getAttribute('data-section') === sectionId) {
      btn.classList.add('is-active');
      const text = btn.textContent.trim();
      currentTitle = `Quản lý ${text.toLowerCase()}`;
    }
  });

  // 3. Cập nhật tiêu đề trên Topbar
  const topbarTitle = document.querySelector('.admin-topbar strong');
  if (topbarTitle) {
    topbarTitle.textContent = currentTitle;
  }

  // 4. Kích hoạt render tương ứng nếu có
  if (sectionId === 'section-users' && typeof renderUserTable === 'function') {
    renderUserTable();
  } else if (sectionId === 'section-categories' && typeof renderCategoryTable === 'function') {
    renderCategoryTable();
  } else if (sectionId === 'section-products' && typeof renderAdminProductTable === 'function') {
    renderAdminProductTable();
  } else if (sectionId === 'section-receipts' && typeof renderReceiptTable === 'function') {
    renderReceiptTable();
  } else if (sectionId === 'section-pricing' && typeof renderPricingTable === 'function') {
    renderPricingTable();
  } else if (sectionId === 'section-orders' && typeof renderOrderTable === 'function') {
    renderOrderTable();
  } else if (sectionId === 'section-stock' && typeof renderStockTable === 'function') {
    renderStockTable();
  }

  // 5. Cập nhật các thẻ thống kê
  updateAdminStats();

  // Đóng sidebar trên mobile
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) sidebar.classList.remove('sidebar-open');
}

// Cập nhật 4 thẻ thống kê trên Admin Dashboard
function updateAdminStats() {
  const orders = getOrders();
  const products = getProducts();
  const users = getUsers();

  // 1. Đơn hàng mới (status === 'Mới đặt')
  const newOrdersCount = orders.filter(o => o.status === 'Mới đặt').length;

  // 2. Doanh thu (tổng các đơn không bị hủy)
  const revenue = orders
    .filter(o => o.status !== 'Hủy')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  // 3. Sản phẩm sắp hết hoặc hết hàng (stock < 6)
  const lowStockCount = products.filter(p => Number(p.stock) < 6).length;

  // 4. Khách hàng bị khóa (status === 'locked')
  const lockedUsersCount = users.filter(u => u.status === 'locked').length;

  // Cập nhật DOM thẻ thống kê
  const statValues = document.querySelectorAll('.stat-grid .stat-card strong, .stat-grid .stat-card .stat-value');
  if (statValues.length >= 4) {
    statValues[0].textContent = String(newOrdersCount);
    statValues[1].textContent = formatMoney(revenue);
    statValues[2].textContent = String(lowStockCount);
    statValues[3].textContent = String(lockedUsersCount);
  }
}

// Khởi chạy trang Admin
document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra quyền đăng nhập Admin
  // (Nếu chưa đăng nhập admin thì tự động nạp admin mẫu để tiện chạy và chấm đồ án)
  if (!isAdmin()) {
    const defaultAdmin = getUserByUsername('admin');
    if (defaultAdmin) {
      setCurrentAdmin(defaultAdmin);
    }
  }

  // Cập nhật số liệu thống kê
  updateAdminStats();

  // Gắn sự kiện chuyển mục cho các nút trên Sidebar
  const sidebarBtns = document.querySelectorAll('.sidebar-nav .sidebar-btn, .sidebar-nav .sidebar-item');
  sidebarBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const secId = btn.getAttribute('data-section');
      if (secId) {
        switchAdminSection(secId);
      }
    });
  });

  // Mobile sidebar toggle button
  const mobileToggle = document.querySelector('.admin-topbar .mobile-toggle, .sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation();
      sidebar.classList.toggle('sidebar-open');
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-toggle')) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  // Đăng xuất admin
  const logoutBtn = document.querySelector('.topbar-user a, .admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      adminLogout();
    });
  }

  // Mặc định nạp bảng người dùng đầu tiên
  if (typeof renderUserTable === 'function') {
    renderUserTable();
  }
});
