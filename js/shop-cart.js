/**
 * shop-cart.js — Giỏ hàng (Drawer), thanh toán, xem lại đơn
 * Dự án Web Bán Ốc — Ốc Xanh
 */

// Lấy tổng số lượng sản phẩm trong giỏ
function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, qty) => sum + Number(qty), 0);
}

// Lấy tổng số tiền trong giỏ
function getCartTotal() {
  const cart = getCart();
  const products = getProducts();
  let total = 0;
  for (const [id, qty] of Object.entries(cart)) {
    const p = products.find(prod => prod.id === id);
    if (p) {
      total += p.price * Number(qty);
    }
  }
  return total;
}

// Cập nhật số lượng trên icon giỏ hàng ở header
function updateHeaderCartBadge() {
  const countEl = document.querySelector('.header .cart-count');
  if (countEl) {
    countEl.textContent = getCartCount();
  }
}

// Thêm sản phẩm vào giỏ (Yêu cầu đăng ký & đăng nhập)
function addToCart(productId, quantity = 1) {
  if (!isLoggedIn()) {
    showToast('Vui lòng đăng nhập để sử dụng giỏ hàng và đặt món!', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  const p = getProductById(productId);
  if (!p) return;

  if (p.stock <= 0) {
    showToast('Sản phẩm này hiện đã hết hàng!', 'warning');
    return;
  }

  const cart = getCart();
  const currentQty = cart[productId] || 0;
  const newQty = Math.min(Number(p.stock), currentQty + Number(quantity));

  if (newQty === currentQty && currentQty >= p.stock) {
    showToast(`Bạn đã thêm tối đa số lượng tồn kho (${p.stock} ${p.unit})`, 'warning');
    return;
  }

  cart[productId] = newQty;
  saveCart(cart);

  updateHeaderCartBadge();
  renderCartDrawer();
  showToast(`Đã thêm ${p.name} vào giỏ hàng`);
}

// Xóa sản phẩm khỏi giỏ
function removeFromCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    delete cart[productId];
    saveCart(cart);
    updateHeaderCartBadge();
    renderCartDrawer();
    renderCheckoutSummary();
    showToast('Đã xóa món khỏi giỏ hàng');
  }
}

// Cập nhật số lượng
function updateCartQuantity(productId, newQty) {
  const p = getProductById(productId);
  if (!p) return;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart();
  cart[productId] = Math.min(Number(p.stock), newQty);
  saveCart(cart);

  updateHeaderCartBadge();
  renderCartDrawer();
  renderCheckoutSummary();
}

// Render nội dung ngăn kéo giỏ hàng (Cart Drawer)
function renderCartDrawer() {
  const drawerEl = document.getElementById('cart-drawer');
  if (!drawerEl) return;

  const count = getCartCount();
  const total = getCartTotal();
  const cart = getCart();
  const products = getProducts();

  // Tiêu đề số lượng
  const countTitle = drawerEl.querySelector('.drawer-header small');
  if (countTitle) countTitle.textContent = `(${count})`;

  const itemsContainer = drawerEl.querySelector('.cart-items');
  const footerContainer = drawerEl.querySelector('.drawer-footer');

  if (count === 0) {
    if (itemsContainer) {
      itemsContainer.innerHTML = `
        <div class="empty" style="padding: 48px 16px; text-align: center;">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="color:var(--ink-500); margin:0 auto 16px;">
            <path d="M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01"/>
          </svg>
          <h3 style="font-size:20px; margin-bottom:8px;">Giỏ hàng đang trống</h3>
          <p style="color:var(--ink-600); margin-bottom:16px;">Thêm một chút vị biển cho bữa ăn hôm nay.</p>
          <button class="btn btn-primary" onclick="closeCartDrawer(); showSection('section-home');">Xem sản phẩm</button>
        </div>
      `;
    }
    if (footerContainer) footerContainer.style.display = 'none';
    return;
  }

  // Có sản phẩm
  let html = '';
  for (const [id, qty] of Object.entries(cart)) {
    const p = products.find(prod => prod.id === id);
    if (!p) continue;
    html += `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" width="85" height="85" onerror="this.style.display='none'">
        <div style="flex:1;">
          <strong>${p.name}</strong>
          <p class="price" style="margin:4px 0 8px;">${formatMoney(p.price)} <small>/ ${p.unit}</small></p>
          <div class="quantity-control">
            <button type="button" aria-label="Giảm" onclick="updateCartQuantity('${p.id}', ${qty - 1})">−</button>
            <span style="min-width:24px; text-align:center; font-weight:700;">${qty}</span>
            <button type="button" aria-label="Tăng" ${qty >= p.stock ? 'disabled' : ''} onclick="updateCartQuantity('${p.id}', ${qty + 1})">+</button>
            <button type="button" class="remove" onclick="removeFromCart('${p.id}')">Xóa</button>
          </div>
        </div>
      </div>
    `;
  }

  if (itemsContainer) itemsContainer.innerHTML = html;

  if (footerContainer) {
    footerContainer.style.display = 'block';
    const totalEl = footerContainer.querySelector('.total strong');
    if (totalEl) totalEl.textContent = formatMoney(total);

    const checkoutBtn = footerContainer.querySelector('.btn-primary');
    if (checkoutBtn) {
      checkoutBtn.onclick = function(e) {
        e.preventDefault();
        closeCartDrawer();
        showSection('section-checkout');
        renderCheckoutSummary();
      };
    }
  }
}

function openCartDrawer() {
  if (!isLoggedIn()) {
    showToast('Vui lòng đăng nhập để xem giỏ hàng!', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  const drawerEl = document.getElementById('cart-drawer');
  if (drawerEl) {
    renderCartDrawer();
    drawerEl.classList.add('is-open');
  }
}

function closeCartDrawer() {
  const drawerEl = document.getElementById('cart-drawer');
  if (drawerEl) {
    drawerEl.classList.remove('is-open');
  }
}

// Render tóm tắt đơn hàng ở trang Thanh toán (#section-checkout)
function renderCheckoutSummary() {
  const curUser = getCurrentUser();
  if (!curUser) {
    showToast('Vui lòng đăng nhập để tiến hành thanh toán!', 'warning');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
    return;
  }

  const summaryEl = document.querySelector('#section-checkout .summary');
  if (!summaryEl) return;

  const count = getCartCount();
  const total = getCartTotal();
  const cart = getCart();
  const products = getProducts();

  const submitBtn = document.querySelector('#section-checkout form button[type="submit"]');

  // Cập nhật thông tin hiển thị địa chỉ từ tài khoản
  const nameAccountEl = document.getElementById('ck-account-name');
  const phoneAccountEl = document.getElementById('ck-account-phone');
  const addrAccountEl = document.getElementById('ck-account-address');

  if (nameAccountEl) nameAccountEl.textContent = curUser.fullname || curUser.username;
  if (phoneAccountEl) phoneAccountEl.textContent = curUser.phone || 'Chưa cung cấp SĐT';
  if (addrAccountEl) addrAccountEl.textContent = curUser.address || 'Chưa có địa chỉ lưu sẵn trong tài khoản (vui lòng chọn "Nhập địa chỉ mới")';

  if (count === 0) {
    summaryEl.innerHTML = `
      <h2>Đơn hàng của bạn</h2>
      <div class="empty" style="padding: 32px 16px; text-align: center;">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" style="color:var(--ink-500); margin:0 auto 12px;">
          <path d="M2 3h3l3 12h11l3-9H6M9 20h.01M18 20h.01"/>
        </svg>
        <h3>Chưa có sản phẩm</h3>
        <p>Hãy thêm sản phẩm vào giỏ hàng trước.</p>
        <button class="btn btn-secondary" onclick="showSection('section-home');" style="margin-top:12px;">Mua sắm ngay</button>
      </div>
      <div class="total">
        <span>Tổng thanh toán</span>
        <strong>0đ</strong>
      </div>
    `;
    if (submitBtn) {
      submitBtn.textContent = 'Đặt hàng · 0đ';
      submitBtn.disabled = true;
    }
    return;
  }

  let itemsHtml = '';
  for (const [id, qty] of Object.entries(cart)) {
    const p = products.find(prod => prod.id === id);
    if (!p) continue;
    itemsHtml += `
      <div class="summary-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid var(--line);">
        <div>
          <strong>${p.name}</strong>
          <small style="display:block; color:var(--ink-600);">${qty} ${p.unit} × ${formatMoney(p.price)}</small>
        </div>
        <strong>${formatMoney(p.price * qty)}</strong>
      </div>
    `;
  }

  summaryEl.innerHTML = `
    <h2>Đơn hàng của bạn</h2>
    <div class="summary-items" style="max-height:300px; overflow-y:auto; margin-bottom:16px;">
      ${itemsHtml}
    </div>
    <div class="total">
      <span>Tổng thanh toán</span>
      <strong>${formatMoney(total)}</strong>
    </div>
    <p style="font-size:13px; color:var(--ink-600); display:flex; align-items:center; gap:6px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <path d="M1 5h13v12H1zM14 9h4l4 4v4h-8M8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0M20 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0"/>
      </svg>
      Phí giao hàng sẽ được cửa hàng gọi xác nhận.
    </p>
  `;

  if (submitBtn) {
    submitBtn.textContent = `Đặt hàng · ${formatMoney(total)}`;
    submitBtn.disabled = false;
  }
}

// Xử lý gửi đơn hàng (Submit Checkout)
function initCheckoutForm() {
  const form = document.querySelector('#section-checkout form');
  if (!form) return;

  // 1. Chuyển đổi giữa Địa chỉ từ tài khoản và Nhập địa chỉ mới
  const optAccount = document.getElementById('opt-address-account');
  const optNew = document.getElementById('opt-address-new');
  const boxAccount = document.getElementById('box-address-account');
  const boxFields = document.getElementById('box-address-fields');

  const nameInput = document.getElementById('ck-name');
  const phoneInput = document.getElementById('ck-phone');
  const addrInput = document.getElementById('ck-address');

  function updateAddressMode(mode) {
    if (mode === 'account') {
      if (optAccount) optAccount.classList.add('selected');
      if (optNew) optNew.classList.remove('selected');
      if (boxAccount) boxAccount.style.display = 'block';
      if (boxFields) boxFields.style.display = 'none';

      if (nameInput) nameInput.removeAttribute('required');
      if (phoneInput) phoneInput.removeAttribute('required');
      if (addrInput) addrInput.removeAttribute('required');
    } else {
      if (optNew) optNew.classList.add('selected');
      if (optAccount) optAccount.classList.remove('selected');
      if (boxAccount) boxAccount.style.display = 'none';
      if (boxFields) boxFields.style.display = 'block';

      if (nameInput) nameInput.setAttribute('required', 'required');
      if (phoneInput) phoneInput.setAttribute('required', 'required');
      if (addrInput) addrInput.setAttribute('required', 'required');
    }
  }

  if (optAccount) {
    optAccount.addEventListener('click', function() {
      const radio = optAccount.querySelector('input');
      if (radio) radio.checked = true;
      updateAddressMode('account');
    });
  }

  if (optNew) {
    optNew.addEventListener('click', function() {
      const radio = optNew.querySelector('input');
      if (radio) radio.checked = true;
      updateAddressMode('new');
    });
  }

  // 2. Lựa chọn phương thức thanh toán
  const paymentRadios = form.querySelectorAll('input[name="payment"]');
  paymentRadios.forEach(radio => {
    const parentCard = radio.closest('.radio-card');
    if (parentCard) {
      parentCard.addEventListener('click', function() {
        form.querySelectorAll('.radio-card').forEach(c => {
          if (c.querySelector('input[name="payment"]')) c.classList.remove('selected');
        });
        parentCard.classList.add('selected');
        radio.checked = true;
      });
    }
  });

  // 3. Xử lý submit đặt hàng
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const curUser = getCurrentUser();
    if (!curUser) {
      showToast('Vui lòng đăng nhập để tiến hành đặt hàng!', 'warning');
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 800);
      return;
    }

    const count = getCartCount();
    if (count === 0) {
      showToast('Giỏ hàng trống! Hãy chọn món trước.', 'warning');
      return;
    }

    // Xác định chế độ địa chỉ
    const addressModeInput = form.querySelector('input[name="address_mode"]:checked');
    const addressMode = addressModeInput ? addressModeInput.value : 'account';

    let customerName = '';
    let customerPhone = '';
    let customerAddress = '';

    if (addressMode === 'account') {
      customerName = curUser.fullname || curUser.username;
      customerPhone = curUser.phone || '';
      customerAddress = curUser.address || '';

      if (!customerAddress) {
        showToast('Tài khoản chưa lưu địa chỉ giao hàng! Vui lòng chọn "Nhập địa chỉ mới" bên dưới.', 'warning');
        updateAddressMode('new');
        const rNew = optNew?.querySelector('input');
        if (rNew) rNew.checked = true;
        return;
      }
    } else {
      if (!validate(boxFields)) return;
      customerName = nameInput.value.trim();
      customerPhone = phoneInput.value.trim();
      customerAddress = addrInput.value.trim();
    }

    const note = document.getElementById('ck-note') ? document.getElementById('ck-note').value.trim() : '';

    const selectedPaymentRadio = form.querySelector('input[name="payment"]:checked');
    const payment = selectedPaymentRadio ? selectedPaymentRadio.parentElement.textContent.trim() : 'Tiền mặt khi nhận hàng';

    // Tạo danh sách sản phẩm đặt
    const cart = getCart();
    const products = getProducts();
    const items = [];

    for (const [id, qty] of Object.entries(cart)) {
      const p = products.find(prod => prod.id === id);
      if (p) {
        items.push({
          productId: p.id,
          name: p.name,
          price: p.price,
          quantity: Number(qty),
          unit: p.unit
        });
      }
    }

    const orderData = {
      customer: customerName,
      userId: curUser.id,
      phone: customerPhone,
      address: customerAddress,
      note: note,
      payment: payment,
      total: getCartTotal(),
      items: items
    };

    const newOrder = addOrder(orderData);
    clearCart();
    updateHeaderCartBadge();

    // Hiển thị màn hình xác nhận đơn hàng
    renderOrderConfirmation(newOrder);
    showSection('section-confirmation');
    showToast('Đặt hàng thành công! Cảm ơn bạn.');
  });
}

// Hiển thị màn hình xem lại đơn hàng sau khi đặt (#section-confirmation)
function renderOrderConfirmation(order) {
  const confirmContainer = document.querySelector('#section-confirmation .panel');
  if (!confirmContainer) return;

  let itemsHtml = '';
  order.items.forEach(i => {
    itemsHtml += `
      <div class="summary-item" style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--line);">
        <span>${i.name} × ${i.quantity} ${i.unit || ''}</span>
        <strong>${formatMoney(i.price * i.quantity)}</strong>
      </div>
    `;
  });

  confirmContainer.innerHTML = `
    <span class="confirmation-icon">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
        <path d="m5 12 4 4L19 6"/>
      </svg>
    </span>
    <h2>Cảm ơn bạn đã lựa chọn Ốc Xanh</h2>
    <p>Mã đơn hàng: <strong>#${order.id}</strong> <span class="badge badge-info">Mới đặt</span></p>
    
    <div style="margin:20px 0; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:12px 0;">
      ${itemsHtml}
    </div>
    
    <p><strong>Người nhận:</strong> ${order.customer} (${order.phone})</p>
    <p><strong>Địa chỉ giao hàng:</strong> ${order.address}</p>
    <p><strong>Hình thức thanh toán:</strong> ${order.payment}</p>
    ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
    
    <div class="total" style="margin:16px 0;">
      <span>Tổng tiền thanh toán:</span>
      <strong>${formatMoney(order.total)}</strong>
    </div>
    
    <button type="button" class="btn btn-primary" onclick="showSection('section-home');">Tiếp tục mua sắm</button>
  `;
}

// Khởi tạo các sự kiện giỏ hàng
document.addEventListener('DOMContentLoaded', function() {
  updateHeaderCartBadge();

  // Nút mở giỏ hàng trên header
  const cartBtn = document.querySelector('.header .cart-button');
  if (cartBtn) {
    cartBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openCartDrawer();
    });
  }

  // Đóng giỏ hàng
  const drawerEl = document.getElementById('cart-drawer');
  if (drawerEl) {
    const closeBtn = drawerEl.querySelector('.modal-close, .icon-button');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeCartDrawer);
    }
    drawerEl.addEventListener('click', function(e) {
      if (e.target === drawerEl) closeCartDrawer();
    });
  }

  // Khởi tạo form checkout
  initCheckoutForm();

  // Nút quay lại từ checkout
  const backFromCheckout = document.querySelector('#section-checkout .back-link');
  if (backFromCheckout) {
    backFromCheckout.addEventListener('click', function(e) {
      e.preventDefault();
      showSection('section-home');
    });
  }
});
