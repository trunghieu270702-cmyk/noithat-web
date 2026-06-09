import { PrismaClient } from '@prisma/client';
import { 
  mockUnits, mockLeads, mockSupervisions, mockArticles, mockSeoPages, 
  mockTestimonials, mockCustomers, mockSettings, mockProjects 
} from './mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old data...');
  await prisma.unit.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.supervision.deleteMany();
  await prisma.article.deleteMany();
  await prisma.seoPage.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.project.deleteMany();

  console.log('Seeding Units...');
  for (const u of mockUnits) {
    const { id, ...data } = u;
    await prisma.unit.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Leads...');
  for (const l of mockLeads) {
    const { id, proposedUnits, ...data } = l;
    await prisma.lead.create({ data: { ...data, proposedUnits: JSON.stringify(proposedUnits), createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Supervisions...');
  for (const s of mockSupervisions) {
    const { id, inspectionItems, ...data } = s;
    await prisma.supervision.create({ data: { ...data, inspectionItems: JSON.stringify(inspectionItems), createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Articles...');
  for (const a of mockArticles) {
    const { id, ...data } = a;
    await prisma.article.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding SeoPages...');
  for (const s of mockSeoPages) {
    const { id, updatedAt, ...data } = s;
    await prisma.seoPage.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Testimonials...');
  for (const t of mockTestimonials) {
    const { id, ...data } = t;
    await prisma.testimonial.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Customers...');
  for (const c of mockCustomers) {
    const { id, ...data } = c;
    await prisma.customer.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding Settings...');
  const settingsData = [
    { key: 'storeName', value: mockSettings.storeName },
    { key: 'address', value: mockSettings.address },
    { key: 'phone', value: mockSettings.phone },
    { key: 'zalo', value: mockSettings.zalo },
    { key: 'email', value: mockSettings.email }
  ];
  for (const s of settingsData) {
    await prisma.setting.create({ data: s });
  }

  console.log('Seeding Projects...');
  for (const p of mockProjects) {
    const { id, ...data } = p;
    await prisma.project.create({ data: { ...data, createdAt: new Date(data.createdAt) } });
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
