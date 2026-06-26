const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const content = fs.readFileSync('other-partners.txt', 'utf8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l);

  // parent category "Đối tác khác" is 14
  const PARENT_CATEGORY_ID = 14;

  const categoriesMap = new Map();

  for (const line of lines) {
    const parts = line.split('\t');
    
    // Some lines have an extra column for logo 2, so the indexing might vary, but based on my earlier check:
    // Name, Subcategory, Location, Website, Logo1, Logo2(sometimes empty), Desc1, Desc2
    
    const name = parts[0]?.trim();
    const subcategoryName = parts[1]?.trim();
    const location = parts[2]?.trim();
    const website = parts[3]?.trim();
    const logo = parts[4]?.trim() || parts[5]?.trim();
    
    // Short desc and desc are at the end
    const desc = parts[parts.length - 1]?.trim();

    if (!name || !subcategoryName) continue;

    // Create or get subcategory
    let categoryId = categoriesMap.get(subcategoryName);
    if (!categoryId) {
      let existingCategory = await prisma.category.findFirst({
        where: { name: subcategoryName, parentId: PARENT_CATEGORY_ID }
      });
      if (!existingCategory) {
        existingCategory = await prisma.category.create({
          data: {
            name: subcategoryName,
            slug: subcategoryName.toLowerCase().replace(/ /g, '-').replace(/đ/g, 'd').replace(/[^a-z0-9-]/g, ''),
            type: 'Đơn vị',
            parentId: PARENT_CATEGORY_ID,
            status: 'ACTIVE'
          }
        });
      }
      categoryId = existingCategory.id;
      categoriesMap.set(subcategoryName, categoryId);
    }

    // Insert unit
    const unitSlug = name.toLowerCase().replace(/ /g, '-').replace(/đ/g, 'd').replace(/[^a-z0-9-]/g, '') + '-' + Date.now().toString().slice(-4);
    
    await prisma.unit.create({
      data: {
        unitId: 'DT' + Date.now().toString().slice(-6),
        name: name,
        slug: unitSlug,
        segment: 'trung-cap', // default
        location: location || 'Toàn quốc',
        projectType: 'Đối tác khác',
        style: subcategoryName,
        status: 'ACTIVE',
        experience: 0,
        shortDescription: desc,
        description: `<p>${desc}</p>`,
        avatar: logo ? [logo] : [],
        profile: website || '',
        categories: {
          connect: [{ id: PARENT_CATEGORY_ID }, { id: categoryId }]
        }
      }
    });

    console.log(`Inserted partner: ${name}`);
  }

  console.log('All partners inserted successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
