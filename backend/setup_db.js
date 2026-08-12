const mysql = require('mysql2/promise');

async function main() {
  const c = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root2!',
    multipleStatements: true
  });

  // Drop and recreate database
  await c.query('DROP DATABASE IF EXISTS vgrow');
  await c.query('CREATE DATABASE vgrow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
  await c.query('USE vgrow');

  // Set row format explicitly
  await c.query("SET SESSION innodb_strict_mode = ON");

  const sql = `
    CREATE TABLE organizations (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      logo VARCHAR(500) NULL,
      timezone VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
      language VARCHAR(10) NOT NULL DEFAULT 'en',
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE users (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20) NULL,
      password_hash VARCHAR(255) NOT NULL,
      avatar VARCHAR(500) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      last_login DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_users_org (organization_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE roles (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      name VARCHAR(100) NOT NULL,
      description VARCHAR(500) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_roles_org (organization_id)
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE permissions (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      module VARCHAR(50) NOT NULL,
      action VARCHAR(50) NOT NULL,
      description VARCHAR(255) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE role_permissions (
      role_id VARCHAR(36) NOT NULL,
      permission_id VARCHAR(36) NOT NULL,
      PRIMARY KEY (role_id, permission_id),
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
      FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE user_roles (
      user_id VARCHAR(36) NOT NULL,
      role_id VARCHAR(36) NOT NULL,
      PRIMARY KEY (user_id, role_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE sessions (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      refresh_token VARCHAR(500) NOT NULL UNIQUE,
      device VARCHAR(255) NULL,
      browser VARCHAR(255) NULL,
      ip VARCHAR(45) NULL,
      expires_at DATETIME(3) NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_sessions_user (user_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE companies (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      name VARCHAR(255) NOT NULL,
      industry VARCHAR(100) NULL,
      website VARCHAR(500) NULL,
      gst_number VARCHAR(20) NULL,
      pan_number VARCHAR(15) NULL,
      employees INT NULL,
      annual_revenue DECIMAL(15,2) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_companies_org (organization_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE contacts (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      company_id VARCHAR(36) NULL,
      owner_id VARCHAR(36) NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(20) NULL,
      designation VARCHAR(100) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_contacts_org (organization_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE leads (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      owner_id VARCHAR(36) NOT NULL,
      company_id VARCHAR(36) NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NULL,
      phone VARCHAR(20) NULL,
      source VARCHAR(50) NOT NULL DEFAULT 'Manual',
      status VARCHAR(50) NOT NULL DEFAULT 'New',
      score INT NOT NULL DEFAULT 0,
      industry VARCHAR(100) NULL,
      website VARCHAR(500) NULL,
      city VARCHAR(100) NULL,
      state VARCHAR(100) NULL,
      country VARCHAR(100) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_leads_org (organization_id),
      INDEX idx_leads_owner (owner_id),
      INDEX idx_leads_status (status),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES users(id),
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE pipelines (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      name VARCHAR(100) NOT NULL,
      is_default BOOLEAN NOT NULL DEFAULT FALSE,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_pipelines_org (organization_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE stages (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      pipeline_id VARCHAR(36) NOT NULL,
      name VARCHAR(100) NOT NULL,
      position INT NOT NULL DEFAULT 0,
      probability INT NOT NULL DEFAULT 100,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_stages_pipeline (pipeline_id),
      FOREIGN KEY (pipeline_id) REFERENCES pipelines(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE deals (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      pipeline_id VARCHAR(36) NOT NULL,
      stage_id VARCHAR(36) NOT NULL,
      company_id VARCHAR(36) NULL,
      contact_id VARCHAR(36) NULL,
      owner_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(15,2) NOT NULL,
      currency VARCHAR(10) NOT NULL DEFAULT 'INR',
      probability INT NOT NULL DEFAULT 100,
      expected_close DATETIME(3) NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'In Progress',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_deals_org (organization_id),
      INDEX idx_deals_stage (stage_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (pipeline_id) REFERENCES pipelines(id),
      FOREIGN KEY (stage_id) REFERENCES stages(id),
      FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE SET NULL,
      FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
      FOREIGN KEY (owner_id) REFERENCES users(id)
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE activities (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      user_id VARCHAR(36) NOT NULL,
      entity_type VARCHAR(30) NOT NULL,
      entity_id VARCHAR(36) NOT NULL,
      activity_type VARCHAR(30) NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_activities_org (organization_id),
      INDEX idx_activities_entity (entity_type, entity_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE tasks (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      assigned_to VARCHAR(36) NOT NULL,
      entity_type VARCHAR(30) NULL,
      entity_id VARCHAR(36) NULL,
      title VARCHAR(255) NOT NULL,
      priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
      status VARCHAR(20) NOT NULL DEFAULT 'Pending',
      due_date DATETIME(3) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_tasks_org (organization_id),
      INDEX idx_tasks_assignee (assigned_to),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;

    CREATE TABLE meetings (
      id VARCHAR(36) NOT NULL PRIMARY KEY,
      organization_id VARCHAR(36) NOT NULL,
      title VARCHAR(255) NOT NULL,
      start_time DATETIME(3) NOT NULL,
      end_time DATETIME(3) NOT NULL,
      meeting_type VARCHAR(50) NOT NULL DEFAULT 'Follow-up',
      location VARCHAR(255) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      INDEX idx_meetings_org (organization_id),
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    ) ENGINE=InnoDB ROW_FORMAT=DYNAMIC;
  `;

  await c.query(sql);
  console.log('All 16 tables created successfully!');

  // Verify
  const [tables] = await c.query('SHOW TABLES');
  console.log('Tables:', tables.map(t => Object.values(t)[0]));

  await c.end();
}

main().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
