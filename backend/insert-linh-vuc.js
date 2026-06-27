const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateSlug = (text) => text.toLowerCase()
  .replace(/ /g, '-')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9-]/g, '');

async function main() {
  const linhVucs = [
    'Homestay', 'Hotel', 'Chung cư', 'Nhà phố', 'Biệt thự', 
    'Quán cafe', 'Nhà hàng', 'Văn phòng', 'Resort', 'Spa'
  ];

  for (const name of linhVucs) {
    const slug = generateSlug(name);
    // Check if exists
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (!existing) {
      await prisma.category.create({
        data: {
          name,
          slug,
          type: 'Lĩnh vực công trình',
          status: 'ACTIVE'
        }
      });
      console.log(`Created Lĩnh vực công trình: ${name}`);
    } else {
      // Update type just in case
      await prisma.category.update({
        where: { slug },
        data: { type: 'Lĩnh vực công trình' }
      });
      console.log(`Updated Lĩnh vực công trình: ${name}`);
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
