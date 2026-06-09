const { PrismaClient } = require('./backend/node_modules/@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const users = await prisma.user.findMany(); 
  console.log(users); 
} 

main().finally(() => prisma.$disconnect());
