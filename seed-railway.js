const API_URL = 'https://backend-production-6a66.up.railway.app/api/v1';

const unitNames = [
  "Nội Thất Hiện Đại", "Không Gian Xanh", "HomeStyle", "ArtDecor", "Zen Design",
  "Luxury Living", "Minimalist Space", "Eco Home", "Smart Space", "Creative Design",
  "Tân Cổ Điển", "Modern House", "Classic Interior", "Vila Design", "Urban Living",
  "Dream Home", "Perfect Space", "Cozy House", "Elite Design", "Prime Interior"
];

const articleTitles = [
  "Xu hướng thiết kế nội thất 2024", "Cách chọn màu sơn cho phòng khách",
  "Bố trí ánh sáng trong phòng ngủ", "Phong thủy nhà bếp cần biết",
  "Tối ưu không gian cho căn hộ nhỏ", "Vật liệu gỗ công nghiệp phổ biến",
  "Cách bảo quản sofa da bền đẹp", "Trang trí ban công chung cư",
  "Lựa chọn rèm cửa phù hợp", "Thiết kế phòng làm việc tại nhà",
  "Mẹo làm sạch thảm trang trí", "Cách tạo điểm nhấn cho phòng khách",
  "Thiết kế nhà bếp thông minh", "Xu hướng phòng tắm hiện đại",
  "Cách chọn đèn trang trí", "Phong cách thiết kế Bắc Âu",
  "Sử dụng cây xanh trong nhà", "Thiết kế nội thất thân thiện môi trường",
  "Màu sắc hợp mệnh phong thủy", "Các lỗi thường gặp khi làm nội thất"
];

const projectNames = [
  "Thiết kế căn hộ 2 phòng ngủ Vinhomes", "Thi công biệt thự Vinhomes Riverside",
  "Nội thất nhà phố hiện đại", "Căn hộ Penthouse Landmark 81",
  "Biệt thự tân cổ điển Ecopark", "Nhà phố liền kề Starlake",
  "Căn hộ studio phong cách Minimalist", "Thiết kế quán cafe sân vườn",
  "Thi công nhà hàng ẩm thực Á", "Nội thất văn phòng công ty công nghệ",
  "Căn hộ 3PN phong cách Indochine", "Biệt thự đơn lập Ciputra",
  "Nội thất chung cư cao cấp D'Capitale", "Thiết kế showroom thời trang",
  "Nhà vườn nghỉ dưỡng Hòa Bình", "Căn hộ Duplex view hồ",
  "Thi công spa chăm sóc sắc đẹp", "Thiết kế homestay Đà Lạt",
  "Nội thất phòng khám nha khoa", "Căn hộ phong cách Scandinavian",
  "Biệt thự song lập Gamuda", "Thiết kế quán trà sữa",
  "Nhà phố thương mại Shophouse", "Căn hộ Officetel linh hoạt",
  "Nội thất chung cư Royal City", "Thiết kế trung tâm tiếng Anh",
  "Biệt thự nghỉ dưỡng Hạ Long", "Căn hộ chung cư Times City",
  "Nội thất biệt thự Vinhomes Ocean Park", "Thiết kế không gian coworking"
];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];

async function postData(endpoint, data) {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Failed to post ${endpoint}: ${res.status} ${text}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.error(`Error posting to ${endpoint}:`, err.message);
    return null;
  }
}

async function seed() {
  console.log('Seeding Units...');
  for (let i = 0; i < 20; i++) {
    await postData('units', {
      name: unitNames[i] || `Unit ${i}`,
      slug: `unit-${Date.now()}-${i}`,
      segment: randomChoice(["Cao cấp", "Bình dân", "Tầm trung"]),
      location: randomChoice(["Hà Nội", "TP.HCM", "Đà Nẵng", "Cần Thơ", "Hải Phòng"]),
      projectType: randomChoice(["Chung cư", "Biệt thự", "Nhà phố", "Văn phòng"]),
      style: randomChoice(["Hiện đại", "Tân cổ điển", "Tối giản", "Indochine", "Bắc Âu"]),
      experience: randomInt(1, 15),
      status: "ACTIVE",
      isVisible: true,
      shortDescription: "Đơn vị thiết kế uy tín hàng đầu",
    });
  }

  console.log('Seeding Articles...');
  for (let i = 0; i < 20; i++) {
    await postData('articles', {
      title: articleTitles[i] || `Article ${i}`,
      slug: `article-${Date.now()}-${i}`,
      category: randomChoice(["Kiến thức", "Phong thủy", "Xu hướng", "Kinh nghiệm"]),
      status: "PUBLISHED",
      author: "Admin",
      summary: "Đây là bài viết chia sẻ kinh nghiệm và kiến thức hữu ích về thiết kế nội thất, giúp bạn có cái nhìn tổng quan hơn.",
      content: "<p>Nội dung chi tiết của bài viết được biên soạn bởi các chuyên gia trong ngành thiết kế nội thất.</p>",
      views: randomInt(10, 500)
    });
  }

  console.log('Seeding Projects...');
  for (let i = 0; i < 30; i++) {
    await postData('projects', {
      name: projectNames[i] || `Project ${i}`,
      status: "COMPLETED",
      unitName: randomChoice(unitNames),
      projectType: randomChoice(["Chung cư", "Biệt thự", "Nhà phố", "Văn phòng"]),
      budget: randomChoice(["Dưới 500 triệu", "500 - 1 tỷ", "Trên 1 tỷ"]),
      area: randomInt(50, 300),
      summary: "Dự án thiết kế và thi công nội thất trọn gói với phong cách hiện đại, tối ưu không gian sử dụng và đảm bảo tính thẩm mỹ cao.",
      location: randomChoice(["Hà Nội", "TP.HCM", "Đà Nẵng"])
    });
  }

  console.log('Seeding completed!');
}

seed();
