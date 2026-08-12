const { prisma } = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixPasswords() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  
  const res = await prisma.user.updateMany({
    data: { passwordHash }
  });
  
  console.log(`Updated passwords for ${res.count} users to "password123"`);
}

fixPasswords().finally(() => prisma.$disconnect());
