const mysql = require('mysql2/promise');

async function main() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root2!'
  });
  
  const [r1] = await c.query("SELECT VERSION() as version");
  console.log('MySQL Version:', r1[0].version);
  
  const [r2] = await c.query("SHOW VARIABLES LIKE 'innodb_default_row_format'");
  console.log('Row Format:', r2);
  
  const [r3] = await c.query("SHOW VARIABLES LIKE 'innodb_large_prefix'");
  console.log('Large Prefix:', r3);

  // Try creating test database with explicit row format
  await c.query("CREATE DATABASE IF NOT EXISTS vgrow DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
  console.log('Database vgrow created/verified');

  await c.end();
}

main().catch(console.error);
