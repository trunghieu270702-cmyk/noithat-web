const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.category.updateMany({
    where: {
      type: { in: ['Đơn vị thiết kế', 'Sản phẩm'] }
    },
    data: {
      type: 'Đơn vị'
    }
  });
  console.log('Updated categories:', result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
