/**
 * data.js — Dữ liệu mẫu + toàn bộ hàm đọc/ghi localStorage
 * Dự án Web Bán Ốc — Ốc Xanh
 * Tuân thủ thiết kế design.md, chạy độc lập không phụ thuộc Internet / file://
 */

const STORAGE_KEYS = {
  PRODUCTS: 'ox_products',
  CATEGORIES: 'ox_categories',
  USERS: 'ox_users',
  ORDERS: 'ox_orders',
  RECEIPTS: 'ox_receipts',
  CART: 'ox_cart',
  CURRENT_USER: 'ox_current_user',
  CURRENT_ADMIN: 'ox_current_admin',
};

// 1. Danh mục mẫu
const DEFAULT_CATEGORIES = [
  { id: 'LOAI01', name: 'Các món ốc', isVisible: true },
  { id: 'LOAI02', name: 'Sò, Hào & Nghêu', isVisible: true },
  { id: 'LOAI03', name: 'Hải sản nướng', isVisible: true },
  { id: 'LOAI04', name: 'Mì, Cơm & Cháo', isVisible: true }
];

// 2. 22 Sản phẩm mẫu theo thực đơn món ốc tươi ngon tuyển chọn
const DEFAULT_PRODUCTS = [
  {
    id: 'SP001',
    name: 'Ốc bươu nướng tiêu',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 85000,
    costPrice: 65000,
    profitMargin: 30,
    stock: 25,
    unit: 'dĩa',
    image: 'images/products/oc-buou-nuong-tieu.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 20,
    description: 'Ốc bươu đồng béo ngậy được nướng trên than hồng, thấm đượm sốt tiêu đen Phú Quốc cay nồng, đậm đà khó cưỡng.'
  },
  {
    id: 'SP002',
    name: 'Ốc hương xào trứng muối',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 145000,
    costPrice: 110000,
    profitMargin: 32,
    stock: 22,
    unit: 'dĩa',
    image: 'images/products/oc-huong-xao-trung-muoi.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 18,
    description: 'Ốc hương tươi sống loại 1 giòn sần sật, phủ lớp sốt trứng muối bùi béo, thơm lừng bơ tỏi, chấm kèm bánh mì cực đỉnh.'
  },
  {
    id: 'SP003',
    name: 
    'Ốc hương rang muối',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 135000,
    costPrice: 100000,
    profitMargin: 35,
    stock: 18,
    unit: 'dĩa',
    image: 'images/products/oc-huong-rang-muoi.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 15,
    description: 'Ốc hương rang muối ớt tuyết giòn rụm bên ngoài vỏ, vị mặn cay đậm đà, thịt ốc bên trong ngọt thanh tự nhiên.'
  },
  {
    id: 'SP004',
    name: 'Ốc mỡ xào me',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 95000,
    costPrice: 70000,
    profitMargin: 35,
    stock: 20,
    unit: 'dĩa',
    image: 'images/products/oc-mo-xao-me.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 18,
    description: 'Ốc mỡ thịt mềm béo hòa quyện nước sốt me chua ngọt sền sệt, rắc tóp mỡ giòn tan và đậu phộng rang bùi ngậy.'
  },
  {
    id: 'SP005',
    name: 'Ốc len xào dừa',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 90000,
    costPrice: 68000,
    profitMargin: 32,
    stock: 24,
    unit: 'dĩa',
    image: 'images/products/oc-len-xao-dua.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 20,
    description: 'Ốc len béo ngậy nấu cùng nước cốt dừa sánh mịn, thơm mùi rau răm, hút từng con ốc ngập tràn vị béo thơm đặc sản Nam Bộ.'
  },
  {
    id: 'SP006',
    name: 'Ốc bulot xào bơ',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 160000,
    costPrice: 120000,
    profitMargin: 33,
    stock: 15,
    unit: 'dĩa',
    image: 'images/products/oc-bulot-xao-bo.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 12,
    description: 'Ốc bulot nhập khẩu thịt dai giòn sần sật, xào sốt bơ tỏi thơm ngậy đặc trưng, ăn kèm muối tiêu chanh hoặc bánh mì nóng.'
  },
  {
    id: 'SP007',
    name: 'Ốc ngựa luộc',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 80000,
    costPrice: 60000,
    profitMargin: 33,
    stock: 4,
    unit: 'dĩa',
    image: 'images/products/oc-ngua-luoc.jpg',
    status: 'Sắp hết',
    isVisible: true,
    isBestSeller: false,
    initialStock: 8,
    description: 'Ốc ngựa tươi luộc với lá chanh và sả đập dập giữ trọn độ tươi ngọt, chấm nước mắm gừng ớt cay nồng chuẩn vị.'
  },
  {
    id: 'SP008',
    name: 'Ốc dừa xào bơ',
    category: 'Các món ốc',
    categoryId: 'LOAI01',
    price: 85000,
    costPrice: 63000,
    profitMargin: 35,
    stock: 16,
    unit: 'dĩa',
    image: 'images/products/oc-dua-xao-bo.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 14,
    description: 'Ốc dừa nhỏ nhắn, thịt giòn ngọt được xào bơ vàng ươm, thơm lừng tỏi phi và vị ngọt béo kích thích vị giác.'
  },
  {
    id: 'SP009',
    name: 'Sò lông nướng mỡ hành',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 85000,
    costPrice: 62000,
    profitMargin: 37,
    stock: 22,
    unit: 'dĩa',
    image: 'images/products/so-long-nuong-mo-hanh.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 18,
    description: 'Sò lông to béo nướng mỡ hành xanh mướt, rắc đậu phộng rang giòn thơm, rưới chút nước mắm chua ngọt đậm đà.'
  },
  {
    id: 'SP010',
    name: 'Sò lông hấp xả',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 75000,
    costPrice: 55000,
    profitMargin: 36,
    stock: 18,
    unit: 'tô',
    image: 'images/products/so-long-hap-xa.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 15,
    description: 'Sò lông hấp sả nóng hổi, thịt sò mềm ngọt ngào thanh khiết, nước hấp thơm dịu mùi sả gừng ấm nồng.'
  },
  {
    id: 'SP011',
    name: 'Sò điệp nướng phô mai',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 110000,
    costPrice: 80000,
    profitMargin: 38,
    stock: 20,
    unit: 'dĩa',
    image: 'images/products/so-diep-nuong-pho-mai.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 16,
    description: 'Cồi sò điệp trắng nõn nướng phủ phô mai Mozzarella béo ngậy kéo sợi, thơm lừng, là món khoái khẩu của tín đồ hải sản.'
  },
  {
    id: 'SP012',
    name: 'Sò dương nướng',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 120000,
    costPrice: 90000,
    profitMargin: 33,
    stock: 5,
    unit: 'con',
    image: 'images/products/so-duong-nuong.jpg',
    status: 'Sắp hết',
    isVisible: true,
    isBestSeller: false,
    initialStock: 8,
    description: 'Sò dương biển tự nhiên kích thước lớn, thớ thịt dày giòn ngọt lịm, nướng mỡ hành hoặc muối ớt cay xé lưỡi.'
  },
  {
    id: 'SP013',
    name: 'Sò huyết xào tỏi',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 105000,
    costPrice: 78000,
    profitMargin: 35,
    stock: 19,
    unit: 'dĩa',
    image: 'images/products/so-huyet-xao-toi.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 15,
    description: 'Sò huyết đầm Ô Loan tươi rói, xào lửa lớn với tỏi phi vàng rụm, giữ trọn độ ngọt béo và vị thanh mát nguyên bản.'
  },
  {
    id: 'SP014',
    name: 'Hào',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 35000,
    costPrice: 25000,
    profitMargin: 40,
    stock: 35,
    unit: 'con',
    image: 'images/products/hao.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 30,
    description: 'Hàu sữa Pháp tươi sống múp míp, nhiều sữa, nướng phô mai tan chảy hoặc nướng mỡ hành thơm nức mũi.'
  },
  {
    id: 'SP015',
    name: 'Nghêu hấp xả',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 75000,
    costPrice: 55000,
    profitMargin: 36,
    stock: 25,
    unit: 'tô',
    image: 'images/products/ngheu-hap-xa.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 20,
    description: 'Nghêu trắng hai cồi ngọt nước, hấp sả ớt cay nhẹ, nước nghêu ngọt lịm húp đến giọt cuối cùng.'
  },
  {
    id: 'SP016',
    name: 'Nghêu hấp thái',
    category: 'Sò, Hào & Nghêu',
    categoryId: 'LOAI02',
    price: 85000,
    costPrice: 62000,
    profitMargin: 37,
    stock: 22,
    unit: 'thố',
    image: 'images/products/ngheu-hap-thai.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 18,
    description: 'Nghêu hấp nước cốt Thái chua cay nồng nàn, thơm mùi lá chanh, riềng, sả và ớt hiểm, cực kỳ kích thích vị giác.'
  },
  {
    id: 'SP017',
    name: 'Tôm nướng muối ớt',
    category: 'Hải sản nướng',
    categoryId: 'LOAI03',
    price: 130000,
    costPrice: 95000,
    profitMargin: 37,
    stock: 20,
    unit: 'dĩa',
    image: 'images/products/tom-nuong-muoi-ot.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 16,
    description: 'Tôm sú tươi sống nướng xiên que trên than hoa, áo đều lớp muối ớt đỏ cay nồng giòn rụm, thịt tôm ngọt lịm.'
  },
  {
    id: 'SP018',
    name: 'Bạch tuộc nướng',
    category: 'Hải sản nướng',
    categoryId: 'LOAI03',
    price: 125000,
    costPrice: 92000,
    profitMargin: 36,
    stock: 18,
    unit: 'dĩa',
    image: 'images/products/bach-tuoc-nuong.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 15,
    description: 'Bạch tuộc tươi ướp sốt sa tế cay nồng nướng vàng thơm, thịt dai giòn sần sật, chấm muối ớt xanh cay cay chua chua.'
  },
  {
    id: 'SP019',
    name: 'Mì xào ốc móng tay',
    category: 'Mì, Cơm & Cháo',
    categoryId: 'LOAI04',
    price: 95000,
    costPrice: 70000,
    profitMargin: 36,
    stock: 20,
    unit: 'dĩa',
    image: 'images/products/mi-xao-oc-mong-tay.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: true,
    initialStock: 16,
    description: 'Mì sợi dai xào rau muống giòn ngọt cùng ốc móng tay béo ngậy, đượm sốt tỏi ớt thơm lừng, món ăn no cực ngon.'
  },
  {
    id: 'SP020',
    name: 'Mì xào hải sản',
    category: 'Mì, Cơm & Cháo',
    categoryId: 'LOAI04',
    price: 105000,
    costPrice: 78000,
    profitMargin: 35,
    stock: 22,
    unit: 'dĩa',
    image: 'images/products/mi-xao-hai-san.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 18,
    description: 'Mì xào giòn hoặc mì mềm kết hợp tôm tươi, mực giòn, ốc và rau củ thanh mát xào lửa lớn đậm đà thơm phức.'
  },
  {
    id: 'SP021',
    name: 'Cơm chiên dương châu',
    category: 'Mì, Cơm & Cháo',
    categoryId: 'LOAI04',
    price: 85000,
    costPrice: 60000,
    profitMargin: 41,
    stock: 25,
    unit: 'dĩa',
    image: 'images/products/com-chien-duong-chau.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 20,
    description: 'Hạt cơm tơi vàng ươm chiên cùng lạp xưởng, tôm nõn, trứng gà, đậu Hà Lan và cà rốt, vị vừa vặn thơm ngon.'
  },
  {
    id: 'SP022',
    name: 'Cháo hàu',
    category: 'Mì, Cơm & Cháo',
    categoryId: 'LOAI04',
    price: 75000,
    costPrice: 54000,
    profitMargin: 39,
    stock: 20,
    unit: 'tô',
    image: 'images/products/chao-hau.jpg',
    status: 'Còn hàng',
    isVisible: true,
    isBestSeller: false,
    initialStock: 16,
    description: 'Cháo hoa nấu nhừ sánh mịn kết hợp hàu sữa tươi xào thơm với hành tím, tiêu xay và hành hoa ấm bụng, bổ dưỡng.'
  }
];

// 3. Người dùng mẫu
const DEFAULT_USERS = [
  {
    id: 'U001',
    username: 'admin',
    password: '123456',
    fullname: 'Quản trị viên',
    email: 'admin@ocxanh.vn',
    phone: '0901234567',
    role: 'admin',
    status: 'active',
    address: '123 Nguyễn Văn Cừ, Quận 5, TP. HCM',
    createdAt: '01/10/2026'
  },
  {
    id: 'U002',
    username: 'nguyenvana',
    password: '123456',
    fullname: 'Nguyễn Văn A',
    email: 'vana@gmail.com',
    phone: '0912345678',
    role: 'customer',
    status: 'active',
    address: '123 Nguyễn Văn Cừ, Quận 5, TP. HCM',
    createdAt: '05/10/2026'
  },
  {
    id: 'U003',
    username: 'tranthib',
    password: '123456',
    fullname: 'Trần Thị B',
    email: 'thib@gmail.com',
    phone: '0923456789',
    role: 'customer',
    status: 'locked',
    address: '45 Lê Lợi, Quận 1, TP. HCM',
    createdAt: '06/10/2026'
  },
  {
    id: 'U004',
    username: 'levanc',
    password: '123456',
    fullname: 'Lê Văn C',
    email: 'vanc@gmail.com',
    phone: '0934567890',
    role: 'customer',
    status: 'active',
    address: '78 Trần Hưng Đạo, Quận 5, TP. HCM',
    createdAt: '08/10/2026'
  }
];

// 4. Đơn hàng mẫu
const DEFAULT_ORDERS = [
  {
    id: 'OX001',
    customer: 'Nguyễn Văn A',
    userId: 'U002',
    phone: '0912345678',
    address: '123 Nguyễn Văn Cừ, Q.5',
    date: '10/10/2026',
    payment: 'Tiền mặt khi nhận hàng',
    status: 'Mới đặt',
    note: 'Giao trong giờ hành chính',
    total: 325000,
    items: [
      { productId: 'SP001', name: 'Ốc bươu nướng tiêu', price: 85000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP002', name: 'Ốc hương xào trứng muối', price: 145000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP019', name: 'Mì xào ốc móng tay', price: 95000, quantity: 1, unit: 'dĩa' }
    ]
  },
  {
    id: 'OX002',
    customer: 'Trần Thị B',
    userId: 'U003',
    phone: '0923456789',
    address: '45 Lê Lợi, Q.1',
    date: '09/10/2026',
    payment: 'Chuyển khoản ngân hàng',
    status: 'Đã xử lý',
    note: 'Nhiều sả ớt giùm mình',
    total: 260000,
    items: [
      { productId: 'SP005', name: 'Ốc len xào dừa', price: 90000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP004', name: 'Ốc mỡ xào me', price: 95000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP015', name: 'Nghêu hấp xả', price: 75000, quantity: 1, unit: 'tô' }
    ]
  },
  {
    id: 'OX003',
    customer: 'Lê Văn C',
    userId: 'U004',
    phone: '0934567890',
    address: '78 Trần Hưng Đạo, Q.5',
    date: '08/10/2026',
    payment: 'Ví điện tử',
    status: 'Đã giao',
    note: 'Lấy thêm muối ớt xanh',
    total: 325000,
    items: [
      { productId: 'SP011', name: 'Sò điệp nướng phô mai', price: 110000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP017', name: 'Tôm nướng muối ớt', price: 130000, quantity: 1, unit: 'dĩa' },
      { productId: 'SP021', name: 'Cơm chiên dương châu', price: 85000, quantity: 1, unit: 'dĩa' }
    ]
  },
  {
    id: 'OX004',
    customer: 'Phạm D',
    userId: null,
    phone: '0945678901',
    address: '12 Hai Bà Trưng, Q.3',
    date: '07/10/2026',
    payment: 'Tiền mặt khi nhận hàng',
    status: 'Hủy',
    note: 'Khách đổi lịch',
    total: 125000,
    items: [
      { productId: 'SP018', name: 'Bạch tuộc nướng', price: 125000, quantity: 1, unit: 'dĩa' }
    ]
  }
];

// 5. Phiếu nhập mẫu
const DEFAULT_RECEIPTS = [
  {
    id: 'PN001',
    date: '10/10/2026',
    status: 'Hoàn thành',
    note: 'Nhập hải sản tươi sống từ Nha Trang',
    total: 6285000,
    lines: [
      { productId: 'SP001', name: 'Ốc bươu nướng tiêu', quantity: 15, costPrice: 65000, total: 975000 },
      { productId: 'SP002', name: 'Ốc hương xào trứng muối', quantity: 20, costPrice: 110000, total: 2200000 },
      { productId: 'SP004', name: 'Ốc mỡ xào me', quantity: 10, costPrice: 70000, total: 700000 },
      { productId: 'SP011', name: 'Sò điệp nướng phô mai', quantity: 12, costPrice: 80000, total: 960000 },
      { productId: 'SP017', name: 'Tôm nướng muối ớt', quantity: 15, costPrice: 95000, total: 1425000 }
    ]
  },
  {
    id: 'PN002',
    date: '12/10/2026',
    status: 'Nháp',
    note: 'Dự kiến nhập thêm nghêu và ốc móng tay',
    total: 2150000,
    lines: [
      { productId: 'SP015', name: 'Nghêu hấp xả', quantity: 20, costPrice: 55000, total: 1100000 },
      { productId: 'SP019', name: 'Mì xào ốc móng tay', quantity: 15, costPrice: 70000, total: 1050000 }
    ]
  }
];

const MENU_DATA_VERSION = 'v3_fixed_badges_seafood';

// Khởi tạo dữ liệu vào localStorage nếu chưa có hoặc rỗng
function initData() {
  try {
    const currentVersion = localStorage.getItem('ox_menu_version');
    const needsMigration = currentVersion !== MENU_DATA_VERSION;

    if (needsMigration) {
      localStorage.setItem('ox_menu_version', MENU_DATA_VERSION);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(DEFAULT_RECEIPTS));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }

    const rawProds = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!rawProds || rawProds === '[]' || rawProds === 'null' || rawProds === '{}') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }
    const rawCats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!rawCats || rawCats === '[]' || rawCats === 'null') {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    } else {
      // Đảm bảo mật khẩu admin là 123456
      try {
        const storedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS));
        const adminIdx = storedUsers.findIndex(u => u.username === 'admin');
        if (adminIdx !== -1 && storedUsers[adminIdx].password !== '123456') {
          storedUsers[adminIdx].password = '123456';
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(storedUsers));
        }
      } catch (err) {}
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RECEIPTS)) {
      localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(DEFAULT_RECEIPTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify({}));
    }
  } catch (e) {
    console.error('Không thể truy cập localStorage:', e);
  }
}

// ----------------- PRODUCTS -----------------
function getProducts() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const parsed = data ? JSON.parse(data) : null;
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    saveProducts(DEFAULT_PRODUCTS);
    return DEFAULT_PRODUCTS;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
}

function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Lỗi lưu products:', e);
  }
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id) || null;
}

function addProduct(productData) {
  const products = getProducts();
  let newId = productData.id ? productData.id.trim() : '';
  if (!newId) {
    const nextNum = products.length + 1;
    newId = 'SP' + String(nextNum).padStart(3, '0');
  }
  const newProduct = {
    id: newId,
    name: productData.name || '',
    category: productData.category || 'Ốc biển',
    categoryId: productData.categoryId || 'LOAI01',
    price: Number(productData.price) || 0,
    costPrice: Number(productData.costPrice) || Math.round((Number(productData.price) || 0) / 1.3),
    profitMargin: Number(productData.profitMargin) || 30,
    stock: Number(productData.stock) || 0,
    unit: productData.unit || 'kg',
    image: productData.image || 'images/products/oc-huong.jpg',
    status: (Number(productData.stock) <= 0) ? 'Hết hàng' : (Number(productData.stock) < 6) ? 'Sắp hết' : 'Còn hàng',
    isVisible: true,
    isBestSeller: Boolean(productData.isBestSeller),
    initialStock: Number(productData.stock) || 0,
    description: productData.description || 'Hải sản tươi ngon tuyển chọn mỗi ngày từ Ốc Xanh.'
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

function deleteProduct(id) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const deleted = products.splice(index, 1)[0];
    saveProducts(products);
    return { success: true, product: deleted };
  }
  return { success: false, message: 'Không tìm thấy sản phẩm' };
}

function updateProduct(id, updatedFields) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    const p = products[index];
    const newStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : p.stock;
    const status = newStock <= 0 ? 'Hết hàng' : newStock < 6 ? 'Sắp hết' : 'Còn hàng';
    products[index] = {
      ...p,
      ...updatedFields,
      stock: newStock,
      status: updatedFields.status || status
    };
    saveProducts(products);
    return products[index];
  }
  return null;
}

function toggleProductVisibility(id) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index].isVisible = !products[index].isVisible;
    saveProducts(products);
    return products[index];
  }
  return null;
}

// ----------------- CATEGORIES -----------------
function getCategories() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    const cats = data ? JSON.parse(data) : DEFAULT_CATEGORIES;
    return cats.map(c => ({
      ...c,
      isVisible: c.isVisible === undefined ? true : c.isVisible
    }));
  } catch (e) {
    return DEFAULT_CATEGORIES;
  }
}

function saveCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  } catch (e) {
    console.error('Lỗi lưu categories:', e);
  }
}

function addCategory(name) {
  const categories = getCategories();
  const nextNum = categories.length + 1;
  const newCat = {
    id: 'LOAI' + String(nextNum).padStart(2, '0'),
    name: name.trim(),
    isVisible: true
  };
  categories.push(newCat);
  saveCategories(categories);
  return newCat;
}

function updateCategory(id, name) {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index].name = name.trim();
    saveCategories(categories);
    // Cập nhật tên loại trong danh sách sản phẩm
    const products = getProducts();
    let hasChanges = false;
    products.forEach(p => {
      if (p.categoryId === id) {
        p.category = name.trim();
        hasChanges = true;
      }
    });
    if (hasChanges) saveProducts(products);
    return categories[index];
  }
  return null;
}

function toggleCategoryVisibility(id) {
  const categories = getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index].isVisible = categories[index].isVisible === false ? true : false;
    saveCategories(categories);
    return categories[index];
  }
  return null;
}

function deleteCategory(id) {
  // Kiểm tra xem có sản phẩm thuộc loại này không
  const products = getProducts();
  const inUse = products.some(p => p.categoryId === id || p.category === id);
  if (inUse) {
    return { success: false, message: 'Không thể xóa loại đang có sản phẩm!' };
  }
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
  return { success: true };
}

// ----------------- USERS -----------------
function getUsers() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch (e) {
    return DEFAULT_USERS;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Lỗi lưu users:', e);
  }
}

function getUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

function getUserByUsername(username) {
  const users = getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase().trim()) || null;
}

function addUser(userData) {
  const users = getUsers();
  const newId = 'U' + String(users.length + 1).padStart(3, '0');
  const d = new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  const newUser = {
    id: newId,
    username: userData.username.trim(),
    password: userData.password,
    fullname: userData.fullname || userData.username,
    email: userData.email || '',
    phone: userData.phone || '',
    role: userData.role || 'customer',
    status: 'active',
    address: userData.address || '',
    createdAt: dateStr
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

function updateUser(id, updatedFields) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedFields };
    saveUsers(users);
    // Cập nhật current user nếu trùng
    const cur = getCurrentUser();
    if (cur && cur.id === id) {
      setCurrentUser(users[index]);
    }
    return users[index];
  }
  return null;
}

function toggleUserLock(id) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    if (users[index].role === 'admin') {
      return { success: false, message: 'Không thể khóa tài khoản quản trị viên!' };
    }
    users[index].status = (users[index].status === 'locked') ? 'active' : 'locked';
    saveUsers(users);
    return { success: true, user: users[index] };
  }
  return { success: false, message: 'Không tìm thấy người dùng' };
}

function resetUserPassword(id, newPassword = '123456') {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users[index].password = newPassword;
    saveUsers(users);
    // Cập nhật current user nếu trùng
    const cur = getCurrentUser();
    if (cur && cur.id === id) {
      setCurrentUser(users[index]);
    }
    return { success: true, message: `Mật khẩu của tài khoản "${users[index].username}" đã được đặt lại thành "${newPassword}"` };
  }
  return { success: false, message: 'Không tìm thấy tài khoản người dùng' };
}

// ----------------- ORDERS -----------------
function getOrders() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return data ? JSON.parse(data) : DEFAULT_ORDERS;
  } catch (e) {
    return DEFAULT_ORDERS;
  }
}

function saveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  } catch (e) {
    console.error('Lỗi lưu orders:', e);
  }
}

function getOrderById(id) {
  const orders = getOrders();
  return orders.find(o => o.id === id) || null;
}

function addOrder(orderData) {
  const orders = getOrders();
  const newNum = orders.length + 1;
  const newId = 'OX' + String(newNum).padStart(3, '0');
  const d = new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const newOrder = {
    id: newId,
    customer: orderData.customer || 'Khách vãng lai',
    userId: orderData.userId || null,
    phone: orderData.phone || '',
    address: orderData.address || '',
    date: dateStr,
    payment: orderData.payment || 'Tiền mặt khi nhận hàng',
    status: 'Mới đặt',
    note: orderData.note || '',
    total: Number(orderData.total) || 0,
    items: orderData.items || []
  };

  orders.unshift(newOrder); // Đơn mới lên đầu
  saveOrders(orders);

  // Trừ tồn kho sản phẩm tương ứng
  const products = getProducts();
  newOrder.items.forEach(item => {
    const p = products.find(prod => prod.id === item.productId || prod.name === item.name);
    if (p) {
      p.stock = Math.max(0, p.stock - item.quantity);
      p.status = p.stock === 0 ? 'Hết hàng' : p.stock < 6 ? 'Sắp hết' : 'Còn hàng';
    }
  });
  saveProducts(products);

  return newOrder;
}

function updateOrderStatus(id, newStatus) {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].status = newStatus;
    saveOrders(orders);
    return orders[index];
  }
  return null;
}

// ----------------- RECEIPTS -----------------
function getReceipts() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.RECEIPTS);
    return data ? JSON.parse(data) : DEFAULT_RECEIPTS;
  } catch (e) {
    return DEFAULT_RECEIPTS;
  }
}

function saveReceipts(receipts) {
  try {
    localStorage.setItem(STORAGE_KEYS.RECEIPTS, JSON.stringify(receipts));
  } catch (e) {
    console.error('Lỗi lưu receipts:', e);
  }
}

function getReceiptById(id) {
  const receipts = getReceipts();
  return receipts.find(r => r.id === id) || null;
}

function addReceipt(receiptData) {
  const receipts = getReceipts();
  const newNum = receipts.length + 1;
  const newId = 'PN' + String(newNum).padStart(3, '0');
  const d = new Date();
  const dateStr = receiptData.date ? formatDate(receiptData.date) : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  const newReceipt = {
    
    id: newId,
    date: dateStr,
    status: receiptData.status || 'Nháp',
    note: receiptData.note || '',
    total: Number(receiptData.total) || 0,
    lines: receiptData.lines || []
  };

  receipts.unshift(newReceipt);
  saveReceipts(receipts);

  // Nếu tạo với trạng thái 'Hoàn thành' thì cập nhật tồn kho ngay
  if (newReceipt.status === 'Hoàn thành') {
    completeReceipt(newId);
  }

  return newReceipt;
}

function updateReceipt(id, receiptData) {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === id);
  if (index !== -1) {
    const r = receipts[index];
    if (r.status === 'Hoàn thành') {
      return { success: false, message: 'Chỉ có thể sửa phiếu nhập trước khi hoàn thành!' };
    }
    const updated = {
      ...r,
      date: receiptData.date ? formatDate(receiptData.date) : r.date,
      note: receiptData.note !== undefined ? receiptData.note : r.note,
      total: Number(receiptData.total) || 0,
      lines: receiptData.lines || r.lines,
      status: receiptData.status || r.status
    };
    receipts[index] = updated;
    saveReceipts(receipts);

    if (updated.status === 'Hoàn thành') {
      completeReceipt(id);
    }
    return { success: true, receipt: receipts[index] };
  }
  return { success: false, message: 'Không tìm thấy phiếu nhập' };
}

function deleteReceipt(id) {
  const receipts = getReceipts();
  const r = receipts.find(item => item.id === id);
  if (!r) return { success: false, message: 'Không tìm thấy phiếu nhập' };
  if (r.status === 'Hoàn thành') {
    return { success: false, message: 'Không thể xóa phiếu nhập đã hoàn thành!' };
  }
  const filtered = receipts.filter(item => item.id !== id);
  saveReceipts(filtered);
  return { success: true };
}

function completeReceipt(id) {
  const receipts = getReceipts();
  const index = receipts.findIndex(r => r.id === id);
  if (index !== -1) {
    const r = receipts[index];
    if (r.status === 'Hoàn thành') return r; // Đã hoàn thành rồi thì bỏ qua

    r.status = 'Hoàn thành';
    saveReceipts(receipts);

    // Cộng tồn kho và cập nhật giá vốn
    const products = getProducts();
    r.lines.forEach(line => {
      const p = products.find(prod => prod.id === line.productId || prod.name === line.name);
      if (p) {
        p.stock += Number(line.quantity);
        p.status = p.stock === 0 ? 'Hết hàng' : p.stock < 6 ? 'Sắp hết' : 'Còn hàng';
        if (Number(line.costPrice) > 0) {
          p.costPrice = Number(line.costPrice);
          p.price = Math.round(p.costPrice * (1 + (p.profitMargin || 30) / 100));
        }
      }
    });
    saveProducts(products);

    return r;
  }
  return null;
}

// ----------------- CART -----------------
function getCart() {
  initData();
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (e) {
    console.error('Lỗi lưu cart:', e);
  }
}

function clearCart() {
  saveCart({});
}

// ----------------- SESSION -----------------
function getCurrentUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  } catch (e) {}
}

function clearCurrentUser() {
  setCurrentUser(null);
}

function getCurrentAdmin() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_ADMIN);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function setCurrentAdmin(admin) {
  try {
    if (admin) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ADMIN, JSON.stringify(admin));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ADMIN);
    }
  } catch (e) {}
}

function clearCurrentAdmin() {
  setCurrentAdmin(null);
}

// Tự động khởi tạo ngay khi nạp file
initData();
