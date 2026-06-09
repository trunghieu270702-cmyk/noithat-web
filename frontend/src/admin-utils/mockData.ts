export const mockDashboardStats = {
  totalUnits: 34,
  totalLeads: 128,
  totalSupervisions: 15,
  totalArticles: 42,
  activeUnits: 30,
  pendingUnits: 3,
  hiddenUnits: 1,
  pendingLeads: 12,
  processingLeads: 45,
  leadsToday: 5,
  leadsThisWeek: 28,
  leadsThisMonth: 105,
  conversionRate: '15.5%',
  publishedArticles: 38,
  indexedSeoPages: 45,
  processingProjects: 18,
};

export const mockDashboardChartData = [
  { date: '01/06', leads: 5, supervisions: 1 },
  { date: '02/06', leads: 8, supervisions: 0 },
  { date: '03/06', leads: 12, supervisions: 2 },
  { date: '04/06', leads: 7, supervisions: 1 },
  { date: '05/06', leads: 15, supervisions: 3 },
  { date: '06/06', leads: 10, supervisions: 0 },
  { date: '07/06', leads: 22, supervisions: 4 },
];

export const mockUnits = [
  {
    id: 1,
    name: 'Công ty Kiến trúc Xanh',
    segment: 'trung-cap',
    location: 'Hà Nội',
    projectType: 'Chung cư, Nhà phố',
    style: 'Hiện đại, Tối giản',
    experience: 5,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 2,
    name: 'Luxury Design Vietnam',
    segment: 'cao-cap',
    location: 'TP.HCM',
    projectType: 'Villa, Biệt thự, Penthouse',
    style: 'Luxury, Indochine',
    experience: 12,
    status: 'ACTIVE',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: 3,
    name: 'Nội thất Mộc Gia',
    segment: 'co-ban',
    location: 'Đà Nẵng',
    projectType: 'Chung cư',
    style: 'Bắc Âu, Wabi-sabi',
    experience: 3,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

export const mockLeads = [
  {
    id: 1,
    customerName: 'Nguyễn Văn Nam',
    phone: '0901234567',
    email: 'nam.nguyen@example.com',
    location: 'Hà Nội',
    source: 'Website Form',
    assignee: 'Sale Minh',
    projectType: 'Chung cư',
    area: 75,
    projectLocation: 'Vinhomes Smart City, Hà Nội',
    currentStatus: 'Đã nhận bàn giao thô',
    budget: '200-500',
    timeline: '1-thang',
    style: 'Hiện đại',
    priority: 'HIGH',
    needs: 'Thiết kế & Thi công trọn gói',
    needSupervision: false,
    needProjectManagement: false,
    notes: 'Khách hàng cần làm gấp để kịp vào ở trước Tết.',
    status: 'NEW', // NEW, CONTACTED, CONSULTING, CHOSEN_UNIT, QUOTED, NEGOTIATING, WON, LOST, CANCELLED
    leadClassification: 'HOT',
    proposedUnits: ['Công ty Kiến trúc Xanh', 'Nội thất Mộc Gia'],
    connectedUnit: '',
    callNotes: 'Đã gọi trao đổi sơ bộ, khách khá gấp.',
    chatNotes: 'Đã gửi qua Zalo các mẫu tham khảo.',
    followUpDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    customerName: 'Trần Thị Thu',
    phone: '0987654321',
    email: 'thu.tran@example.com',
    location: 'TP.HCM',
    source: 'Facebook Ads',
    assignee: 'Sale Lan',
    projectType: 'Villa',
    area: 300,
    projectLocation: 'Thảo Điền, Quận 2, TP.HCM',
    currentStatus: 'Đất trống, đang xin phép XD',
    budget: 'tren-3ty',
    timeline: '3-thang',
    style: 'Luxury, Tân cổ điển',
    priority: 'MEDIUM',
    needs: 'Thiết kế',
    needSupervision: true,
    needProjectManagement: true,
    notes: 'Yêu cầu kiến trúc sư có kinh nghiệm lâu năm.',
    status: 'CONSULTING',
    leadClassification: 'WARM',
    proposedUnits: ['Luxury Design Vietnam'],
    connectedUnit: 'Luxury Design Vietnam',
    callNotes: 'Khách yêu cầu gặp mặt trực tiếp KTS.',
    chatNotes: '',
    followUpDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 3,
    customerName: 'Lê Hoàng',
    phone: '0933334444',
    email: '',
    location: 'Đà Nẵng',
    source: 'Tiktok',
    assignee: 'Sale Hùng',
    projectType: 'Nhà phố',
    area: 120,
    projectLocation: 'Hải Châu, Đà Nẵng',
    currentStatus: 'Nhà cũ cần cải tạo',
    budget: '500-1ty',
    timeline: 'ngay',
    style: 'Tối giản',
    priority: 'LOW',
    needs: 'Cải tạo trọn gói',
    needSupervision: false,
    needProjectManagement: false,
    notes: 'Muốn giữ lại một số đồ gỗ cũ.',
    status: 'WON',
    leadClassification: 'HOT',
    proposedUnits: ['Nội thất Mộc Gia'],
    connectedUnit: 'Nội thất Mộc Gia',
    callNotes: 'Đã chốt thiết kế, đang chờ thi công.',
    chatNotes: '',
    followUpDate: '',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

export const mockSupervisions = [
  {
    id: 1,
    packageName: 'Giám sát Toàn diện',
    packageType: 'Trọn gói',
    shortDescription: 'Quản lý và giám sát toàn bộ quá trình thi công từ A-Z',
    targetAudience: 'Chủ nhà không có thời gian, cần người đại diện quản lý chất lượng.',
    scopeOfWork: 'Kiểm tra vật tư, giám sát kỹ thuật, nghiệm thu từng giai đoạn, báo cáo tiến độ.',
    duration: 'Theo tiến độ công trình (tối đa 6 tháng)',
    feeStructure: 'Theo % giá trị hợp đồng thi công hoặc m2',
    status: 'ACTIVE',
    inspectionItems: ['Kết cấu', 'Điện nước', 'Hoàn thiện', 'Lắp đặt nội thất'],
    inspectionFrequency: 'Hàng ngày',
    reportFrequency: 'Cuối mỗi tuần & Sau mỗi giai đoạn',
    reportFormat: 'File PDF kèm hình ảnh/video thực tế',
    acceptanceChecklist: 'Áp dụng bộ tiêu chuẩn TCVN và tiêu chuẩn nội bộ',
    responsibility: 'Chịu trách nhiệm 100% về chất lượng và tiến độ theo hợp đồng',
    conditions: 'Công trình từ 100m2 trở lên',
    limitations: 'Không áp dụng cho công trình cải tạo nhỏ lẻ',
    metaTitle: 'Dịch vụ Giám sát Thi công Toàn diện | Nền Tảng Nội Thất',
    metaDescription: 'Dịch vụ quản lý dự án và giám sát thi công chuyên nghiệp giúp chủ nhà an tâm tuyệt đối.',
    keyword: 'giám sát thi công, quản lý dự án nội thất',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 2,
    packageName: 'Giám sát Thiết yếu (Theo giai đoạn)',
    packageType: 'Theo hạn mức',
    shortDescription: 'Kiểm tra các hạng mục quan trọng nhất để phòng ngừa rủi ro.',
    targetAudience: 'Chủ nhà có kinh nghiệm nhưng cần chuyên gia nghiệm thu điểm mù.',
    scopeOfWork: 'Nghiệm thu điện nước âm, chống thấm, kết cấu trước khi đóng trần.',
    duration: 'Tối đa 10 buổi kiểm tra',
    feeStructure: 'Gói cố định hoặc theo số buổi',
    status: 'ACTIVE',
    inspectionItems: ['Điện nước âm', 'Chống thấm', 'Kích thước tủ bếp'],
    inspectionFrequency: 'Chỉ khi chủ nhà yêu cầu',
    reportFrequency: 'Ngay sau mỗi buổi kiểm tra',
    reportFormat: 'Biên bản nghiệm thu tại công trình',
    acceptanceChecklist: 'Checklist rút gọn cho các hạng mục thiết yếu',
    responsibility: 'Chỉ chịu trách nhiệm trên các điểm đã kiểm tra',
    conditions: 'Áp dụng mọi công trình',
    limitations: 'Không bảo lãnh tiến độ tổng thể',
    metaTitle: 'Giám sát Thi công Theo Giai Đoạn - Tiết kiệm chi phí',
    metaDescription: 'Kiểm tra các hạng mục quan trọng giúp bạn an tâm với chi phí thấp nhất.',
    keyword: 'giám sát thiết yếu, nghiệm thu nội thất',
    createdAt: new Date(Date.now() - 86400000 * 40).toISOString()
  }
];

export const mockArticles = [
  {
    id: 1,
    title: '5 sai lầm thường gặp khi tự thuê thi công nội thất',
    slug: '5-sai-lam-thuong-gap-khi-tu-thue-thi-cong-noi-that',
    category: 'Kinh nghiệm thi công',
    author: 'Chuyên gia NoiThat',
    summary: 'Bài viết tổng hợp những rủi ro và sai lầm phổ biến khiến gia chủ tốn kém chi phí và thời gian khi tự đứng ra quản lý thi công.',
    content: '<p>Nội dung chi tiết của bài viết...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?q=80&w=600&auto=format&fit=crop',
    views: 1250,
    status: 'PUBLISHED',
    metaTitle: '5 Sai Lầm Thường Gặp Khi Tự Thuê Thi Công Nội Thất | NoiThat',
    metaDescription: 'Khám phá 5 sai lầm tai hại khi tự thuê thợ thi công nội thất và cách phòng tránh để tiết kiệm chi phí, thời gian cho gia đình bạn.',
    keyword: 'sai lầm thi công nội thất, tự thuê thợ thi công',
    faqSchema: true,
    publishedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 16).toISOString()
  },
  {
    id: 2,
    title: 'Làm nội thất chung cư 200 triệu cần ưu tiên gì?',
    slug: 'lam-noi-that-chung-cu-200-trieu-can-uu-tien-gi',
    category: 'Theo ngân sách',
    author: 'Admin',
    summary: 'Hướng dẫn cách phân bổ ngân sách 200 triệu đồng cho nội thất chung cư một cách thông minh và tối ưu nhất.',
    content: '<p>Nội dung chi tiết của bài viết...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=600&auto=format&fit=crop',
    views: 840,
    status: 'PUBLISHED',
    metaTitle: 'Tư Vấn Làm Nội Thất Chung Cư 200 Triệu Đồng Tối Ưu',
    metaDescription: 'Với 200 triệu, bạn nên đầu tư nội thất chung cư như thế nào? Cùng xem hướng dẫn chi tiết cách tối ưu chi phí từ chuyên gia.',
    keyword: 'nội thất chung cư 200 triệu',
    faqSchema: false,
    publishedAt: new Date(Date.now() - 86400000 * 20).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 22).toISOString()
  },
  {
    id: 3,
    title: 'Phân biệt phong cách Indochine và Wabi-sabi',
    slug: 'phan-biet-phong-cach-indochine-va-wabi-sabi',
    category: 'Cẩm nang phong cách',
    author: 'KTS. Lê Văn',
    summary: 'Phân tích chi tiết sự khác biệt về triết lý, chất liệu và màu sắc giữa hai phong cách thiết kế đang làm mưa làm gió hiện nay.',
    content: '<p>Nội dung chi tiết của bài viết...</p>',
    thumbnail: '',
    views: 0,
    status: 'DRAFT',
    metaTitle: '',
    metaDescription: '',
    keyword: '',
    faqSchema: false,
    publishedAt: '',
    createdAt: new Date().toISOString()
  }
];

export const mockSeoPages = [
  {
    id: 1,
    title: 'Thiết kế nội thất chung cư trọn gói',
    slug: 'thiet-ke-noi-that-chung-cu',
    keyword: 'thiết kế nội thất chung cư',
    lsiKeywords: 'thi công chung cư, nội thất căn hộ, báo giá nội thất chung cư',
    content: '<p>Nội dung landing page thiết kế nội thất chung cư...</p>',
    status: 'PUBLISHED',
    metaTitle: 'Thiết Kế Nội Thất Chung Cư Trọn Gói | Báo Giá Mới Nhất 2026',
    metaDescription: 'Dịch vụ thiết kế và thi công nội thất chung cư trọn gói uy tín, chuyên nghiệp. Nhận báo giá chi tiết và ưu đãi mới nhất 2026.',
    schemaType: 'LocalBusiness',
    views: 3450,
    conversionRate: '4.5%',
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 2,
    title: 'Công ty thiết kế nội thất biệt thự cao cấp',
    slug: 'thiet-ke-noi-that-biet-thu',
    keyword: 'thiết kế nội thất biệt thự',
    lsiKeywords: 'nội thất villa, thi công biệt thự tân cổ điển',
    content: '<p>Nội dung landing page biệt thự...</p>',
    status: 'PUBLISHED',
    metaTitle: 'Thiết Kế Nội Thất Biệt Thự Cao Cấp | Báo Giá & Mẫu Đẹp',
    metaDescription: 'Tổng hợp các mẫu thiết kế nội thất biệt thự siêu sang trọng, đẳng cấp. Đơn vị thi công villa uy tín hàng đầu.',
    schemaType: 'Article',
    views: 1200,
    conversionRate: '2.1%',
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 10).toISOString()
  }
];

export const mockTestimonials = [];

export const mockCustomers = [
  {
    id: 1,
    fullName: 'Nguyễn Văn Nam',
    phoneNumber: '0901234567',
    email: 'nam.nguyen@example.com',
    address: 'Hà Nội',
    totalLeads: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    fullName: 'Trần Thị Thu',
    phoneNumber: '0987654321',
    email: 'thu.tran@example.com',
    address: 'Hồ Chí Minh',
    totalLeads: 1,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

export const mockSettings = {
  storeName: "Nền Tảng Nội Thất",
  address: "Quận 1, TP.HCM",
  phone: "0900 111 222",
  zalo: "0900 111 222",
  email: "contact@noithat.vn"
};

export const mockProjects = [
  {
    id: 1,
    name: 'Biệt thự Vinhomes Riverside',
    unitId: 2,
    unitName: 'Luxury Design Vietnam',
    projectType: 'Biệt thự',
    budget: '5.2 tỷ',
    area: 450,
    status: 'IN_PROGRESS',
    startDate: new Date(Date.now() - 86400000 * 60).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 65).toISOString()
  },
  {
    id: 2,
    name: 'Căn hộ Đảo Kim Cương',
    unitId: 1,
    unitName: 'Công ty Kiến trúc Xanh',
    projectType: 'Chung cư',
    budget: '850 triệu',
    area: 110,
    status: 'COMPLETED',
    startDate: new Date(Date.now() - 86400000 * 120).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 130).toISOString()
  },
  {
    id: 3,
    name: 'Nhà phố thương mại Sala',
    unitId: 1,
    unitName: 'Công ty Kiến trúc Xanh',
    projectType: 'Nhà phố',
    budget: '1.5 tỷ',
    area: 220,
    status: 'IN_PROGRESS',
    startDate: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  }
];
