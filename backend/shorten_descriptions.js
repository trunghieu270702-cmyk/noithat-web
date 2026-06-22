const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const shortenText = (text) => {
  if (!text) return text;
  // Simplification mapping or just string splitting
  if (text.includes(':')) {
    return text.split(':')[0].trim();
  }
  if (text.includes('—')) {
    return text.split('—')[0].trim();
  }
  if (text.length > 50) {
    return text.substring(0, 50) + '...';
  }
  return text;
};

async function run() {
  const units = await prisma.unit.findMany();
  for (const unit of units) {
    const newShort = shortenText(unit.shortDescription);
    const newDesc = shortenText(unit.description);
    
    // update
    await prisma.unit.update({
      where: { id: unit.id },
      data: {
        shortDescription: newShort,
        description: unit.description // keep long desc intact for detail page? Wait, user said "danh mục sản phẩm" which is shortDescription.
      }
    });
  }
  console.log("Updated categories.");
}

run().finally(() => prisma.$disconnect());
