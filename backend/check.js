const { prisma } = require('./config/db');

async function main() {
  const orgCount = await prisma.organization.count();
  const users = await prisma.user.findMany();
  console.log('Org count:', orgCount);
  console.log('Users:', users);
}

main().finally(() => prisma.$disconnect());
