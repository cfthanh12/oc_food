/**
 * admin-receipts.js — Quản lý phiếu nhập hàng (Admin: tạo phiếu, thêm dòng, hoàn thành, xem chi tiết)
 * Dự án Web Bán Ốc — Ốc Xanh
 */

let receiptSearchKeyword = '';

function renderReceiptTable() {
  const tbody = document.querySelector('#section-receipts tbody');
  if (!tbody) return;

  let receipts = getReceipts();

  if (receiptSearchKeyword) {
    const kw = receiptSearchKeyword.toLowerCase();
    receipts = receipts.filter(r =>
      r.id.toLowerCase().includes(kw) ||
      (r.note && r.note.toLowerCase().includes(kw)) ||
      (r.date && r.date.includes(kw))
    );
  }

  if (receipts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:32px 16px; color:var(--ink-500);">
          Không có phiếu nhập hàng nào phù hợp.
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  receipts.forEach(r => {
    const isCompleted = r.status === 'Hoàn thành';
    const badgeHtml = `<span class="badge ${isCompleted ? 'badge-success' : 'badge-neutral'}">${r.status}</span>`;

    let actionHtml = `<button class="btn-link" type="button" onclick="viewReceiptDetail('${r.id}')">Xem</button>`;
    if (!isCompleted) {
      actionHtml += `
        <button class="btn-link" style="margin-left:8px;" type="button" onclick="openCreateReceiptModal('${r.id}')">Sửa</button>
        <button class="btn-link" style="color:var(--success-fg); font-weight:700; margin-left:8px;" type="button" onclick="handleCompleteReceipt('${r.id}')">Hoàn thành</button>
      `;
    }

    html += `
      <tr>
        <td><strong>${r.id}</strong></td>
        <td>${formatDate(r.date)}</td>
        <td>${r.lines ? r.lines.length : 0} dòng</td>
        <td><strong>${formatMoney(r.total)}</strong></td>
        <td>${badgeHtml}</td>
        <td>${actionHtml}</td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function handleCompleteReceipt(receiptId) {
  openConfirmModal(
    'Xác nhận hoàn thành phiếu nhập',
    `Sau khi hoàn thành, số lượng tồn kho và giá vốn của các sản phẩm trong phiếu sẽ được tự động cộng dồn vào kho. Thao tác này không thể hoàn tác. Bạn có chắc chắn?`,
    function() {
      const res = completeReceipt(receiptId);
      if (res) {
        showToast(`Đã hoàn thành phiếu nhập ${receiptId}`);
        renderReceiptTable();
        if (typeof renderStockTable === 'function') renderStockTable();
        if (typeof renderAdminProductTable === 'function') renderAdminProductTable();
        if (typeof renderPricingTable === 'function') renderPricingTable();
        if (typeof updateAdminStats === 'function') updateAdminStats();
      }
    }
  );
}

// Xem chi tiết phiếu nhập
function viewReceiptDetail(receiptId) {
  const r = getReceiptById(receiptId);
  if (!r) return;

  let linesHtml = '';
  (r.lines || []).forEach((line, idx) => {
    linesHtml += `
      <tr>
        <td>${idx + 1}</td>
        <td><strong>${line.name}</strong></td>
        <td style="text-align:right;">${line.quantity}</td>
        <td style="text-align:right;">${formatMoney(line.costPrice)}</td>
        <td style="text-align:right;"><strong>${formatMoney(line.total || (line.quantity * line.costPrice))}</strong></td>
      </tr>
    `;
  });

  const detailContent = `
    <div style="padding:8px 0;">
      <p style="margin-bottom:6px;"><strong>Mã phiếu nhập:</strong> ${r.id} <span class="badge ${r.status === 'Hoàn thành' ? 'badge-success' : 'badge-neutral'}">${r.status}</span></p>
      <p style="margin-bottom:6px;"><strong>Ngày nhập:</strong> ${formatDate(r.date)}</p>
      ${r.note ? `<p style="margin-bottom:12px;"><strong>Ghi chú:</strong> ${r.note}</p>` : ''}
      
      <div class="table-scroll" style="margin:16px 0; max-height:280px;">
        <table class="table" style="font-size:13px;">
          <thead>
            <tr>
              <th>#</th>
              <th>Sản phẩm</th>
              <th style="text-align:right;">Số lượng</th>
              <th style="text-align:right;">Giá nhập</th>
              <th style="text-align:right;">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${linesHtml}
          </tbody>
        </table>
      </div>
      
      <div class="total" style="display:flex; justify-content:space-between; font-size:18px; margin-top:12px;">
        <span>Tổng giá trị phiếu nhập:</span>
        <strong style="color:var(--color-primary);">${formatMoney(r.total)}</strong>
      </div>
    </div>
  `;

  let confirmEl = document.getElementById('modal-confirm');
  if (confirmEl) {
    const titleEl = confirmEl.querySelector('h2');
    const msgEl = confirmEl.querySelector('p');
    const confirmBtn = confirmEl.querySelector('.btn-danger, .btn-primary');
    const cancelBtn = confirmEl.querySelector('.btn-secondary');

    if (titleEl) titleEl.textContent = `Chi tiết phiếu nhập ${r.id}`;
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

// Modal tạo / chỉnh sửa phiếu nhập
function openCreateReceiptModal(receiptIdToEdit = null) {
  let existingReceipt = null;
  if (receiptIdToEdit) {
    existingReceipt = getReceiptById(receiptIdToEdit);
    if (!existingReceipt) return;
    if (existingReceipt.status === 'Hoàn thành') {
      showToast('Chỉ có thể sửa phiếu nhập trước khi hoàn thành!', 'warning');
      return;
    }
  }

  let modalEl = document.getElementById('modal-receipt');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'modal-receipt';
    modalEl.className = 'overlay';
    document.body.appendChild(modalEl);
  }

  const products = getProducts();
  const productOptions = products.map(p => `<option value="${p.id}" data-price="${p.costPrice || Math.round(p.price / 1.3)}">${p.name} (Tồn: ${p.stock})</option>`).join('');

  // Ngày mặc định: hôm nay theo định dạng YYYY-MM-DD
  const now = new Date();
  const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let defaultDateVal = todayYMD;
  if (existingReceipt && existingReceipt.date) {
    const dObj = parseDateString(existingReceipt.date);
    if (dObj) {
      defaultDateVal = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
    }
  }

  modalEl.innerHTML = `
    <section class="modal" role="dialog" aria-modal="true" aria-label="Phiếu nhập hàng" style="max-width:760px;">
      <h2>${existingReceipt ? `Chỉnh sửa phiếu nhập ${existingReceipt.id}` : 'Tạo phiếu nhập hàng mới'}</h2>
      <form id="form-create-receipt">
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div class="field">
            <label for="rc-date">Ngày nhập hàng *</label>
            <input type="date" class="input" id="rc-date" required value="${defaultDateVal}">
          </div>
          <div class="field">
            <label for="rc-status">Trạng thái phiếu</label>
            <select class="select" id="rc-status">
              <option value="Hoàn thành" ${existingReceipt && existingReceipt.status === 'Hoàn thành' ? 'selected' : ''}>Hoàn thành (cộng kho ngay)</option>
              <option value="Nháp" ${(!existingReceipt || existingReceipt.status === 'Nháp') ? 'selected' : ''}>Lưu nháp</option>
            </select>
          </div>
          <div class="field">
            <label for="rc-note">Ghi chú phiếu nhập</label>
            <input class="input" id="rc-note" placeholder="Nhập ghi chú nguồn hàng..." value="${existingReceipt ? (existingReceipt.note || '') : ''}">
          </div>
        </div>

        <h3 style="font-size:16px; margin:16px 0 8px;">Danh sách mặt hàng nhập</h3>
        <div class="table-scroll" style="margin-bottom:12px;">
          <table class="table" id="table-receipt-lines">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th style="width:130px;">Giá nhập (đ)</th>
                <th style="width:100px;">Số lượng</th>
                <th style="width:130px; text-align:right;">Thành tiền</th>
                <th style="width:50px;"></th>
              </tr>
            </thead>
            <tbody>
              <!-- Dòng nhập hàng -->
            </tbody>
          </table>
        </div>

        <button type="button" class="btn btn-secondary" id="btn-add-receipt-line" style="font-size:13px; min-height:36px; padding:0 12px;">
          + Thêm dòng sản phẩm
        </button>

        <div class="total" style="display:flex; justify-content:space-between; font-size:18px; margin:20px 0 16px;">
          <span>Tổng tiền nhập:</span>
          <strong id="receipt-grand-total" style="color:var(--color-primary);">0đ</strong>
        </div>

        <div class="form-actions" style="display:flex; justify-content:flex-end; gap:8px;">
          <button type="button" class="btn btn-secondary" onclick="closeModal('modal-receipt')">Hủy</button>
          <button type="submit" class="btn btn-primary">Lưu phiếu nhập</button>
        </div>
      </form>
    </section>
  `;

  const tbody = modalEl.querySelector('#table-receipt-lines tbody');
  const addLineBtn = modalEl.querySelector('#btn-add-receipt-line');
  const grandTotalEl = modalEl.querySelector('#receipt-grand-total');

  function calculateGrandTotal() {
    let sum = 0;
    tbody.querySelectorAll('tr').forEach(row => {
      const price = Number(row.querySelector('.line-price')?.value) || 0;
      const qty = Number(row.querySelector('.line-qty')?.value) || 0;
      const total = price * qty;
      const totalCell = row.querySelector('.line-total');
      if (totalCell) totalCell.textContent = formatMoney(total);
      sum += total;
    });
    grandTotalEl.textContent = formatMoney(sum);
  }

  function addRow(initialData = null) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <select class="select line-prod" style="min-height:38px; padding:0 8px;">
          ${productOptions}
        </select>
      </td>
      <td>
        <input type="number" class="input line-price" min="0" step="1000" value="${initialData ? initialData.costPrice : (products[0]?.costPrice || 100000)}" style="min-height:38px; padding:0 8px;">
      </td>
      <td>
        <input type="number" class="input line-qty" min="1" value="${initialData ? initialData.quantity : 10}" style="min-height:38px; padding:0 8px;">
      </td>
      <td style="text-align:right;" class="line-total"><strong>0đ</strong></td>
      <td>
        <button type="button" class="btn-link btn-link-danger btn-del-row" style="font-size:16px;">×</button>
      </td>
    `;

    const prodSelect = tr.querySelector('.line-prod');
    const priceInput = tr.querySelector('.line-price');

    if (initialData && initialData.productId) {
      prodSelect.value = initialData.productId;
    }

    prodSelect.addEventListener('change', function() {
      const selected = prodSelect.options[prodSelect.selectedIndex];
      const p = selected.getAttribute('data-price');
      if (p) priceInput.value = p;
      calculateGrandTotal();
    });

    tr.querySelectorAll('input').forEach(inp => inp.addEventListener('input', calculateGrandTotal));

    tr.querySelector('.btn-del-row').addEventListener('click', function() {
      if (tbody.querySelectorAll('tr').length > 1) {
        tr.remove();
        calculateGrandTotal();
      } else {
        showToast('Phiếu nhập phải có ít nhất 1 dòng sản phẩm', 'warning');
      }
    });

    tbody.appendChild(tr);
    calculateGrandTotal();
  }

  if (existingReceipt && existingReceipt.lines && existingReceipt.lines.length > 0) {
    existingReceipt.lines.forEach(line => addRow(line));
  } else {
    addRow();
    addRow();
  }

  addLineBtn.addEventListener('click', () => addRow());

  const form = modalEl.querySelector('#form-create-receipt');
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const lines = [];
    let total = 0;

    tbody.querySelectorAll('tr').forEach(row => {
      const prodSelect = row.querySelector('.line-prod');
      const prodId = prodSelect.value;
      const prodName = prodSelect.options[prodSelect.selectedIndex].text.split(' (Tồn:')[0];
      const costPrice = Number(row.querySelector('.line-price').value) || 0;
      const qty = Number(row.querySelector('.line-qty').value) || 0;
      const lineTotal = costPrice * qty;

      if (qty > 0) {
        lines.push({
          productId: prodId,
          name: prodName,
          quantity: qty,
          costPrice: costPrice,
          total: lineTotal
        });
        total += lineTotal;
      }
    });

    if (lines.length === 0) {
      showToast('Vui lòng thêm sản phẩm và số lượng nhập', 'warning');
      return;
    }

    const dateVal = document.getElementById('rc-date').value;
    const status = document.getElementById('rc-status').value;
    const note = document.getElementById('rc-note').value.trim();

    if (existingReceipt) {
      const res = updateReceipt(existingReceipt.id, {
        date: dateVal,
        status: status,
        note: note,
        total: total,
        lines: lines
      });
      if (res.success) {
        showToast(status === 'Hoàn thành' ? 'Đã hoàn thành và cộng kho phiếu nhập!' : 'Đã cập nhật phiếu nhập nháp');
      } else {
        showToast(res.message, 'warning');
      }
    } else {
      addReceipt({
        date: dateVal,
        status: status,
        note: note,
        total: total,
        lines: lines
      });
      showToast(status === 'Hoàn thành' ? 'Đã tạo và cộng kho thành công!' : 'Đã lưu phiếu nhập dạng nháp');
    }

    closeModal('modal-receipt');
    renderReceiptTable();
    if (typeof renderStockTable === 'function') renderStockTable();
    if (typeof renderAdminProductTable === 'function') renderAdminProductTable();
    if (typeof renderPricingTable === 'function') renderPricingTable();
    if (typeof updateAdminStats === 'function') updateAdminStats();
  });

  openModal('modal-receipt');
}

// Gắn sự kiện
document.addEventListener('DOMContentLoaded', function() {
  const createBtn = document.querySelector('#section-receipts .btn-primary');
  if (createBtn) {
    createBtn.addEventListener('click', openCreateReceiptModal);
  }

  const searchInput = document.querySelector('#section-receipts .quick-search input');
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      receiptSearchKeyword = e.target.value.trim();
      renderReceiptTable();
    });
  }
});
