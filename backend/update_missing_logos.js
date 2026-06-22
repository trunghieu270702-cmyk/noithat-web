const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const gotrangtri = await prisma.unit.findFirst({ where: { name: { contains: "Gỗ Trang Trí" } } });
  if (gotrangtri) {
    await prisma.unit.update({
      where: { id: gotrangtri.id },
      data: {
        avatar: [{ url: "https://gotrangtri.vn/wp-content/uploads/2019/07/logo.png" }]
      }
    });
    console.log("Updated Gỗ Trang Trí");
  }

  const vuongquoc = await prisma.unit.findFirst({ where: { name: { contains: "Vương Quốc Nội Thất" } } });
  if (vuongquoc) {
    await prisma.unit.update({
      where: { id: vuongquoc.id },
      data: {
        avatar: [{ url: "https://vuongquocnoithat.vn/images/2019/02/18/0-0-0-logo1111.png" }]
      }
    });
    console.log("Updated Vương Quốc Nội Thất");
  }
}

run().finally(() => prisma.$disconnect());
