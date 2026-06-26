const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const units = await prisma.unit.findMany({
    include: { categories: true }
  });

  for (const unit of units) {
    let categoryIdsToConnect = [];

    if (unit.projectType === 'Đối tác cung cấp') {
      categoryIdsToConnect = [12, 26, 28];
    } else if (unit.projectType === 'Đối tác thi công') {
      categoryIdsToConnect = [13, 25, 27];
    } else if (unit.projectType === 'Cả 2' || unit.projectType === 'Ca 2') {
      categoryIdsToConnect = [12, 26, 28, 13, 25, 27];
    }

    if (categoryIdsToConnect.length > 0) {
      await prisma.unit.update({
        where: { id: unit.id },
        data: {
          categories: {
            connect: categoryIdsToConnect.map(id => ({ id }))
          }
        }
      });
      console.log(`Updated unit ${unit.id} (${unit.name}) with categories: ${categoryIdsToConnect.join(', ')}`);
    }
  }

  console.log('Migration complete!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
