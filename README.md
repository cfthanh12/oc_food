# 🌊 ĐỒ ÁN MÔN HỌC: LẬP TRÌNH WEB VÀ ỨNG DỤNG
## 🦀 ĐỀ TÀI: WEBSITE BÁN ỐC & HẢI SẢN TƯƠI SỐNG — "ỐC XANH"
> **Trường Đại học Sài Gòn (SGU) — Khoa Công nghệ Thông tin**  
> **Clickable Prototype E-Commerce Website** (Website thương mại điện tử hoàn chỉnh giao diện & tương tác)

---

## 📌 MỤC LỤC
1. [Giới thiệu tổng quan đồ án](#1-giới-thiệu-tổng-quan-đồ-án)
2. [Công nghệ & Thư viện sử dụng](#2-công-nghệ--thư-viện-sử-dụng)
3. [Cấu trúc thư mục & Giải thích chi tiết mã nguồn](#3-cấu-trúc-thư-mục--giải-thích-chi-tiết-mã-nguồn)
4. [Hướng dẫn cài đặt & Cách chạy Website](#4-hướng-dẫn-cài-đặt--cách-chạy-website)
5. [Thông tin tài khoản đăng nhập mẫu](#5-thông-tin-tài-khoản-đăng-nhập-mẫu)
6. [Bảng đối chiếu chức năng với Barem chấm điểm (10.0/10.0)](#6-bảng-đối-chiếu-chức-năng-với-barem-chấm-điểm-100100)
7. [Các lưu ý quan trọng khi nộp bài & Báo cáo giảng viên](#7-các-lưu-ý-quan-trọng-khi-nộp-bài--báo-cáo-giảng-viên)

---

## 1. GIỚI THIỆU TỔNG QUAN ĐỒ ÁN

**Ốc Xanh** là website thương mại điện tử chuyên kinh doanh các món ốc và hải sản tươi ngon, đậm đà phong vị ẩm thực Việt Nam.

Đồ án được xây dựng dưới dạng **Clickable Prototype Website hoàn chỉnh**, đáp ứng đầy đủ cả hai phân hệ lớn theo đúng yêu cầu đề tài môn học:
* **Phân hệ Khách hàng (End-User):** Trải nghiệm xem thực đơn theo phân loại, phân trang số trang, tìm kiếm cơ bản và tìm kiếm nâng cao (lọc theo danh mục + khoảng giá), xem chi tiết món ăn, đăng ký/đăng nhập, quản lý giỏ hàng, đặt hàng thanh toán và theo dõi lịch sử đơn hàng cá nhân.
* **Phân hệ Quản trị viên (Admin):** Quản lý toàn diện cửa hàng gồm quản lý người dùng (khóa/mở khóa, reset mật khẩu), quản lý loại sản phẩm, quản lý món ăn (thêm/sửa/xóa/ẩn), quản lý phiếu nhập hàng, quản lý định giá & tỉ lệ % lợi nhuận, quản lý duyệt đơn hàng và báo cáo thống kê tồn kho (nhập - xuất - tồn, cảnh báo sắp hết hàng).

---

## 2. CÔNG NGHỆ & THƯ VIỆN SỬ DỤNG

Dự án tuân thủ tiêu chí **độc lập, tối ưu hiệu năng, gọn nhẹ và không phụ thuộc vào kết nối Internet** khi chấm bài trên laptop giảng viên.

### 2.1. Frontend
* **HTML5 Semantic:** Sử dụng cấu trúc thẻ chuẩn ngữ nghĩa (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<dialog>`), giúp mã nguồn tường minh và dễ bảo trì.
* **CSS3 Hiện đại (Modern CSS):**
  * **CSS Custom Properties (Biến CSS):** Định nghĩa toàn bộ hệ thống màu sắc chủ đạo (`--color-primary`, `--color-accent`), khoảng cách (`spacing`), kích thước chữ và bóng đổ (`box-shadow`) tại `css/common.css`.
  * **Flexbox & CSS Grid:** Bố cục linh hoạt cho lưới sản phẩm (Product Grid), bảng quản trị Admin, thanh điều hướng và giỏ hàng.
  * **Responsive Design:** Tương thích trên cả Desktop, Máy tính bảng và Điện thoại di động (có Mobile Menu Hamburger).
  * **Transitions & Keyframe Animations:** Hiệu ứng hover nổi nhẹ, chuyển tab mượt mà, thanh gạch chân menu trượt thông minh.
* **JavaScript thuần (Vanilla JavaScript - ES6+):**
  * **100% Pure JavaScript:** Không sử dụng bất kỳ thư viện hay framework bên ngoài nào (không React, không Vue, không Angular, không jQuery). Điều này giúp trang tải tức thì, mã nguồn trong sáng, nhóm dễ dàng hiểu và giải thích cặn kẽ từng dòng code cho giảng viên khi bảo vệ đồ án.
  * Tận dụng các tính năng hiện đại: `Arrow Functions`, `Template Literals`, `Destructuring`, `Array methods` (`map`, `filter`, `reduce`, `find`), `DOM Manipulation`.
* **Biểu tượng (Vector SVG Icons):**
  * Toàn bộ icon (giỏ hàng, tìm kiếm, người dùng, mũi tên, đóng/mở) được nhúng trực tiếp bằng mã **Inline SVG**, không dùng thư viện mạng như FontAwesome hay Bootstrap Icons. Nhờ đó, **không bao giờ bị mất icon** khi máy chấm không có mạng.
* **Phông chữ hiển thị:**
  * Sử dụng hệ phông tiêu chuẩn hệ điều hành: `Arial, "Helvetica Neue", Helvetica, sans-serif` kết hợp mã hóa tiếng Việt `UTF-8`. Đảm bảo hiển thị chuẩn xác 100% tiếng Việt có dấu, không bao giờ bị lỗi ô vuông hay mất dấu trên mọi hệ điều hành (Windows, macOS, Linux).

### 2.2. Cơ chế lưu trữ dữ liệu (Client-Side Storage)
* **HTML5 `localStorage`:** Đóng vai trò như một **Cơ sở dữ liệu NoSQL/JSON** thu nhỏ hoạt động trực tiếp trên trình duyệt.
* Toàn bộ dữ liệu mẫu (22 sản phẩm, 4 danh mục, người dùng, đơn hàng, phiếu nhập kho, giỏ hàng) được định nghĩa sẵn trong `js/data.js`.
* Khi ứng dụng khởi chạy lần đầu, dữ liệu sẽ tự động nạp vào `localStorage`. Mọi thao tác Thêm / Sửa / Xóa / Đổi trạng thái đều được cập nhật bền vững vào `localStorage` — **tải lại trang (F5) không hề bị mất dữ liệu**.

### 2.3. Máy chủ Web nội bộ (Backend / Local Web Server)
* **Node.js (Core Modules):** Tự xây dựng máy chủ tĩnh siêu nhẹ qua file `server.js` chỉ dùng các module có sẵn của Node.js: `http`, `fs`, `path`.
* **Zero Dependency:** **Không cài thêm bất kỳ gói npm ngoài nào** (không cần Express, không cần chạy `npm install`, không có thư mục `node_modules` nặng nề hàng trăm MB).
* **Header chống lưu Cache (`Cache-Control: no-cache, no-store, must-revalidate`):** Giúp trình duyệt luôn tải file mới nhất, không bị dính cache cũ khi chấm bài hay phát triển.
* **Cổng phục vụ mặc định:** `PORT = 3000` (tránh xung đột với cổng 80, 8080 của các phần mềm khác).
* **Script khởi chạy 1-Click:** File `start.bat` tiện lợi trên Windows.

---

## 3. CẤU TRÚC THƯ MỤC & GIẢI THÍCH CHI TIẾT MÃ NGUỒN

```text
d:/banoc/oc-shop/
├── index.html              # Trang chính khách hàng (Trang chủ, Sản phẩm, Tìm kiếm, Giỏ hàng, Tài khoản)
├── login.html              # Trang đăng nhập & đăng ký dành riêng cho khách hàng
├── admin.html              # Trang tổng hợp khu vực quản trị viên (Admin Dashboard & các phân hệ)
├── admin-login.html        # Trang đăng nhập riêng biệt dành cho Admin (Bảo mật, không tab đăng ký)
├── server.js               # Máy chủ HTTP Node.js nội bộ phục vụ chạy web
├── start.bat               # File script nhấp đúp để tự khởi động web trên Windows
├── yeucau.md               # File barem yêu cầu chấm điểm chi tiết của Khoa CNTT - ĐH Sài Gòn
├── README.md               # Tài liệu tổng quan kiến trúc và hướng dẫn đồ án
│
├── css/                    # Thư mục mã nguồn giao diện (CSS)
│   ├── common.css          # Biến dùng chung, reset CSS, nút bấm, input, phân trang, toast thông báo
│   ├── shop.css            # Toàn bộ giao diện khách hàng (Header, Banner, Product Card, Modal, Cart)
│   └── admin.css           # Toàn bộ giao diện trang quản trị (Sidebar, Bảng dữ liệu, Form quản lý)
│
├── js/                     # Thư mục mã nguồn logic xử lý (JavaScript)
│   ├── data.js             # "Database": Dữ liệu mẫu (22 món ốc, user, đơn hàng) & hàm đọc/ghi localStorage
│   ├── auth.js             # Logic xác thực: Đăng ký, đăng nhập, đăng xuất, kiểm tra quyền hạn (Role)
│   ├── utils.js            # Các hàm tiện ích: Định dạng tiền tệ VND, ngày tháng, hiển thị Toast popup
│   │
│   ├── shop.js             # Điều hướng menu chính khách hàng, đóng mở dropdown, chuyển section
│   ├── shop-products.js    # Render danh sách món ăn, lọc theo loại, phân trang, modal chi tiết, tìm kiếm
│   ├── shop-cart.js        # Logic giỏ hàng, thêm/sửa/xóa món, tính tiền, chọn địa chỉ, đặt hàng
│   ├── shop-account.js     # Quản lý thông tin tài khoản cá nhân của khách hàng & xem lịch sử đơn hàng
│   │
│   ├── admin.js            # Điều hướng chuyển đổi các tab quản trị, thống kê tổng quan (Dashboard)
│   ├── admin-products.js   # Quản lý món ăn: Thêm mới, sửa thông tin, ẩn/hiện, xóa món
│   ├── admin-categories.js # Quản lý danh mục loại ốc: Thêm, sửa, xóa/ẩn danh mục
│   ├── admin-receipts.js   # Quản lý nhập hàng: Tạo phiếu nhập, nhập số lượng & giá vốn, hoàn thành phiếu
│   ├── admin-pricing.js    # Quản lý giá bán: Tra cứu giá vốn, cập nhật % tỉ lệ lợi nhuận, tự tính giá bán
│   ├── admin-orders.js     # Quản lý đơn hàng: Lọc theo ngày/trạng thái, duyệt đơn (Đã xử lý, Đã giao, Hủy)
│   ├── admin-stock.js      # Quản lý tồn kho: Báo cáo nhập - xuất - tồn, cảnh báo món sắp hết hàng
│   └── admin-users.js      # Quản lý người dùng: Xem DS khách hàng, khóa/mở tài khoản, reset mật khẩu
│
├── images/                 # Thư mục hình ảnh dự án
│   ├── products/           # Toàn bộ hình ảnh thực tế của 22 món ốc và hải sản tươi ngon
│   ├── banners/            # Banner quảng cáo, banner giới thiệu
│   └── icons/              # Favicon, logo thương hiệu Ốc Xanh
│
└── fonts/                  # Thư mục phông chữ dự phòng
```

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CÁCH CHẠY WEBSITE

Website hỗ trợ linh hoạt 3 cách chạy, đặc biệt **tương thích hoàn hảo trên máy tính của Giảng viên**:

### 🔹 Cách 1: Khởi động 1-Click bằng `start.bat` (Khuyên dùng trên Windows)
1. Mở thư mục dự án `oc-shop`.
2. Nhấp đúp chuột trái vào file **`start.bat`**.
3. Cửa sổ dòng lệnh sẽ tự bật Server và **tự động mở trình duyệt Chrome/Edge** vào thẳng địa chỉ:  
   👉 `http://localhost:3000/index.html`

---

### 🔹 Cách 2: Khởi động qua dòng lệnh Node.js (Cho mọi hệ điều hành)
1. Mở Terminal / PowerShell / Command Prompt tại thư mục dự án.
2. Kiểm tra máy đã cài Node.js chưa bằng lệnh: `node -v`
3. Chạy file server:
   ```bash
   node server.js
   ```
4. Truy cập các đường dẫn trên trình duyệt:
   * **Trang chủ Khách hàng:** [http://localhost:3000/index.html](http://localhost:3000/index.html)
   * **Trang Đăng nhập Khách hàng:** [http://localhost:3000/login.html](http://localhost:3000/login.html)
   * **Trang Đăng nhập Quản trị viên (Admin):** [http://localhost:3000/admin-login.html](http://localhost:3000/admin-login.html)
   * **Trang Quản trị Admin:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html)

---

### 🔹 Cách 3: Chạy Offline trực tiếp (Double-click file HTML — Không cần cài Node.js)
Trong trường hợp máy giảng viên không có sẵn Node.js hoặc quy định chấm bài mở file trực tiếp (`file:///`):
1. Mở trực tiếp file `index.html` bằng trình duyệt **Google Chrome** hoặc **Mozilla Firefox**.
2. Toàn bộ logic giao diện, chuyển trang, giỏ hàng và cơ sở dữ liệu `localStorage` vẫn hoạt động bình thường 100%.

> [!TIP]
> **Mẹo khi kiểm tra / cập nhật mã nguồn:**  
> Nhấn tổ hợp phím **`Ctrl + F5`** (hoặc `Shift + F5`) trên trình duyệt để xóa sạch cache và nạp phiên bản CSS/JS mới nhất.

---

## 5. THÔNG TIN TÀI KHOẢN ĐĂNG NHẬP MẪU

Dữ liệu đã được nạp sẵn các tài khoản để nhóm dễ dàng biểu diễn trong buổi báo cáo:

| Vai trò (Role) | Tên đăng nhập (`username`) | Mật khẩu | Trang đăng nhập | Mục đích kiểm thử |
| :--- | :--- | :--- | :--- | :--- |
| **Quản trị viên (Admin)** | `admin` | `123456` | `admin-login.html` | Truy cập toàn bộ 8 phân hệ quản trị của cửa hàng |
| **Khách hàng 1 (Active)** | `nguyenvana` | `123456` | `login.html` | Tài khoản bình thường: Xem thông tin, mua hàng, xem lịch sử đơn |
| **Khách hàng 2 (Active)** | `levanc` | `123456` | `login.html` | Tài khoản khách hàng mẫu thứ hai |
| **Khách hàng 3 (Locked)** | `tranthib` | `123456` | `login.html` | **Tài khoản đang bị khóa**: Dùng để test tính năng thông báo tài khoản bị khóa khi đăng nhập |

*(Ngoài ra, bạn hoàn toàn có thể tự bấm **Đăng ký** tài khoản mới tại `login.html`, tài khoản mới sẽ lập tức lưu vào `localStorage` và đăng nhập được ngay).*

---

## 6. BẢNG ĐỐI CHIẾU CHỨC NĂNG VỚI BAREM CHẤM ĐIỂM (10.0/10.0)

Bảng đối chiếu chi tiết giúp các thành viên trong nhóm tự tin trả lời vấn đáp khi giảng viên hỏi vị trí file mã nguồn của từng chức năng:

### PHẦN I: CÁC CHỨC NĂNG CHO ADMIN (5.0 ĐIỂM)

| STT | Chức năng theo Barem Khoa CNTT | Điểm | File giao diện (HTML/CSS) | File xử lý dữ liệu (JS) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Giao diện Admin**<br>• Trang đăng nhập riêng không dùng chung với khách hàng<br>• Danh mục chức năng quản trị rõ ràng | 0.50 | `admin-login.html`<br>`admin.html`<br>`css/admin.css` | `js/auth.js`<br>`js/admin.js` |
| **2** | **Quản lý người dùng / khách hàng**<br>• Hiển thị danh sách khách hàng<br>• Reset mật khẩu về mặc định<br>• Khóa / Mở khóa tài khoản | 0.25<br>0.25<br>0.25 | `admin.html` (tab `#tab-users`) | `js/admin-users.js` |
| **3** | **Quản lý loại sản phẩm**<br>• Thêm loại mới, sửa tên loại, xóa / ẩn loại sản phẩm | 0.50 | `admin.html` (tab `#tab-categories`) | `js/admin-categories.js` |
| **4** | **Quản lý danh mục sản phẩm (Món ăn)**<br>• Thêm sản phẩm (loại, mã, tên, hình ảnh, mô tả)<br>• Sửa sản phẩm (hiện đúng thông tin cũ trước khi sửa)<br>• Xóa / Ẩn sản phẩm khỏi menu | 0.25<br>0.25<br>0.25 | `admin.html` (tab `#tab-products`) | `js/admin-products.js` |
| **5** | **Quản lý Nhập sản phẩm**<br>• Danh mục & tìm kiếm phiếu nhập<br>• Thêm phiếu nhập (ngày nhập, giá nhập, số lượng từng món)<br>• Sửa phiếu & Chỉ cho sửa khi chưa *Hoàn thành* | 0.25<br>0.25<br>0.25 | `admin.html` (tab `#tab-receipts`) | `js/admin-receipts.js` |
| **6** | **Quản lý giá bán**<br>• Nhập/sửa tỉ lệ % lợi nhuận theo loại hoặc từng món<br>• Tra cứu giá vốn, % lợi nhuận và tự tính giá bán chuẩn | 0.25<br>0.25 | `admin.html` (tab `#tab-pricing`) | `js/admin-pricing.js` |
| **7** | **Quản lý đơn đặt hàng của khách hàng**<br>• Tra cứu đơn hàng theo khoảng ngày & theo tình trạng<br>• Xem chi tiết đơn hàng & cập nhật trạng thái (Mới đặt, Đã xử lý, Đã giao, Hủy) | 0.25<br>0.25 | `admin.html` (tab `#tab-orders`) | `js/admin-orders.js` |
| **8** | **Quản lý tồn kho sản phẩm**<br>• Tra cứu tồn kho theo món, theo loại tại thời điểm<br>• Cảnh báo sản phẩm sắp hết hàng (stock < 6)<br>• Bảng tra cứu Nhập – Xuất – Tồn trong khoảng thời gian | 0.25<br>0.25<br>0.25 | `admin.html` (tab `#tab-stock`) | `js/admin-stock.js` |

---

### PHẦN II: CÁC CHỨC NĂNG CHO KHÁCH HÀNG / END-USER (5.0 ĐIỂM)

| STT | Chức năng theo Barem Khoa CNTT | Điểm | File giao diện (HTML/CSS) | File xử lý dữ liệu (JS) |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **Quản lý đăng nhập & Tài khoản**<br>• Đăng ký tài khoản mới<br>• Đăng nhập / Đăng xuất (hiện tên & avatar trên Header)<br>• Quản lý xem / sửa thông tin cá nhân | 0.25<br>0.25<br>0.50 | `login.html`<br>`index.html`<br>`css/shop.css` | `js/auth.js`<br>`js/shop-account.js` |
| **2** | **Hiển thị & Tìm kiếm món ăn**<br>• Xem theo phân loại danh mục, có phân trang chuẩn đẹp<br>• Xem chi tiết món ăn (Modal popup hiển thị đầy đủ)<br>• Tìm kiếm cơ bản (theo tên món ăn)<br>• Tìm kiếm nâng cao (kết hợp tên + loại + khoảng giá + phân trang) | 0.50<br>0.50<br>0.50<br>0.50 | `index.html` (`#products`, `#section-search`)<br>`css/shop.css`<br>`css/common.css` | `js/shop-products.js` |
| **3** | **Mua sản phẩm bằng giỏ hàng**<br>• Ràng buộc: Bắt buộc đăng nhập mới được mua hàng<br>• Chọn mua từ menu hoặc từ modal chi tiết<br>• Tăng/giảm số lượng, xóa món trong giỏ hàng<br>• Chọn địa chỉ từ tài khoản hoặc nhập địa chỉ mới<br>• Chọn thanh toán (Tiền mặt COD, Chuyển khoản, Trực tuyến)<br>• Hóa đơn xem lại chi tiết sau khi hoàn tất mua hàng | 0.50<br>0.50<br>0.50<br>0.25 | `index.html` (Cart Drawer & Checkout Section)<br>`css/shop.css` | `js/shop-cart.js` |
| **4** | **Xem lại lịch sử đơn hàng đã mua**<br>• Xem danh sách các đơn hàng của riêng khách hàng đó kèm trạng thái | 0.25 | `index.html` (`#section-orders`) | `js/shop-account.js` |

---

## 7. CÁC LƯU Ý QUAN TRỌNG KHI NỘP BÀI & BÁO CÁO GIẢNG VIÊN

1. **Không xóa thư mục hình ảnh (`images/`):** Toàn bộ đường dẫn ảnh sản phẩm đều trỏ tương đối nội bộ vào thư mục `images/products/`. Khi copy bài sang USB hoặc nén file `.zip`, hãy đảm bảo giữ nguyên cấu trúc thư mục.
2. **Khởi tạo lại dữ liệu gốc nếu cần:** Nếu trong quá trình thử nghiệm lỡ xóa bớt sản phẩm hoặc đơn hàng, bạn chỉ cần mở Console trình duyệt (`F12`), gõ `localStorage.clear()` rồi tải lại trang (`Ctrl + F5`), hệ thống sẽ tự động phục hồi lại 22 món ăn và các dữ liệu mẫu chuẩn ban đầu.
3. **Thanh điều hướng và phân trang mượt mà:**
   * Thanh gạch chân màu xanh trên menu được lập trình thông minh: **Chỉ hiển thị duy nhất ở tab đang chọn**, không bị xung đột hay hiện 2 gạch cùng lúc.
   * Các nút số trang `1, 2, 3...` được bo góc hiện đại, tự động tính số trang chính xác dựa theo số lượng món ăn thực tế.

---
> 💡 *Chúc nhóm thực hiện buổi báo cáo đồ án thành công và đạt điểm số tối đa (10/10)!* 🚀

