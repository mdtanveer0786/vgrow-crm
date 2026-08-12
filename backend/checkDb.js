const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabase() {
  console.log("Checking database for 'HelloGrowthCRM'...");
  let found = false;

  // Check Organizations
  const orgs = await prisma.organization.findMany();
  for (const org of orgs) {
    if (org.name.includes('HelloGrowthCRM') || org.slug.includes('HelloGrowthCRM')) {
      console.log(`Found in Organization: ${org.id}`);
      found = true;
    }
  }

  // Check Users
  const users = await prisma.user.findMany();
  for (const user of users) {
    if ((user.firstName && user.firstName.includes('HelloGrowthCRM')) || 
        (user.lastName && user.lastName.includes('HelloGrowthCRM')) ||
        (user.email && user.email.includes('HelloGrowthCRM'))) {
      console.log(`Found in User: ${user.id}`);
      found = true;
    }
  }

  if (!found) {
    console.log("Not found in core database tables.");
  }
  
  await prisma.$disconnect();
}

checkDatabase().catch(e => {
  console.error(e);
  prisma.$disconnect();
});
