const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Tenant Model (Multi-tenancy support)
const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING,
    unique: true
  },
  logo: { type: DataTypes.STRING, defaultValue: '' },
  currency: { type: DataTypes.STRING, defaultValue: 'INR' },
  email: { type: DataTypes.STRING, defaultValue: '' },
  website: { type: DataTypes.STRING, defaultValue: '' },
  phone: { type: DataTypes.STRING, defaultValue: '' },
  gstinEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  gstinProvider: { type: DataTypes.STRING, defaultValue: '' },
  gstinApiKey: { type: DataTypes.STRING, defaultValue: '' },
  defaultLandingPage: { type: DataTypes.STRING, defaultValue: 'Dashboard' },
  whatsappAutoReplyEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
  fieldVisitTrackingEnabled: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// User Model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'sales_rep' // admin, sales_rep, manager
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active' // active, suspended
  }
});

// Lead Model
const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  industry: { type: DataTypes.STRING },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Prospecting' // Contact, Contacted, Qualified, Proposal Sent, Converted, Lost
  },
  temperature: {
    type: DataTypes.STRING,
    defaultValue: 'Warm' // Cold, Warm, Hot
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  nextAction: { type: DataTypes.STRING },
  followUpDate: { type: DataTypes.DATE },
  lastTouch: { type: DataTypes.DATE }
});

// Account Model (Companies)
const Account = sequelize.define('Account', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  industry: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  phone: { type: DataTypes.STRING }
});

// Activity Model (Interactions)
const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING, // WhatsApp, Email, Call, Meeting, Note
    allowNull: false
  },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  direction: {
    type: DataTypes.STRING,
    defaultValue: 'outbound' // inbound, outbound
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Completed' // Pending, Completed, Failed
  },
  duration: { type: DataTypes.INTEGER } // in seconds for calls/meetings
});

// Product Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  sku: { type: DataTypes.STRING, unique: true },
  category: { type: DataTypes.STRING },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Active' } // Active, Archived
});

// Employee Model (for HR)
const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Active' }, // Active, On Leave, Suspended
  department: { type: DataTypes.STRING }
});

// Ticket Model (for Customer support)
const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subject: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' }, // Low, Medium, High, Urgent
  status: { type: DataTypes.STRING, defaultValue: 'Open' }, // Open, In Progress, Resolved, Closed
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING }
});

// CustomRole Model (for Admin > Team settings)
const CustomRole = sequelize.define('CustomRole', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  permissions: { type: DataTypes.TEXT } // Stringified JSON
});

// Quote Model
const Quote = sequelize.define('Quote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Draft' }, // Draft, Sent, Accepted, Rejected
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Proposal Model
const Proposal = sequelize.define('Proposal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  leadName: { type: DataTypes.STRING },
  status: { type: DataTypes.STRING, defaultValue: 'Draft' }, // Draft, Pending Review, Accepted, Rejected
  value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// Invoice Model
const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  client: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Unpaid' }, // Unpaid, Paid, Overdue
  dueDate: { type: DataTypes.DATE }
});

// Task Model
const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  dueDate: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // Pending, In Progress, Completed
  priority: { type: DataTypes.STRING, defaultValue: 'Medium' } // Low, Medium, High
});

// Event Model (Calendar)
const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  time: { type: DataTypes.STRING }
});

// Associations
Tenant.hasMany(User, { foreignKey: 'tenantId' });
User.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Lead, { foreignKey: 'tenantId' });
Lead.belongsTo(Tenant, { foreignKey: 'tenantId' });

User.hasMany(Lead, { foreignKey: 'ownerId', as: 'ownedLeads' });
Lead.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

Tenant.hasMany(Account, { foreignKey: 'tenantId' });
Account.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Activity, { foreignKey: 'tenantId' });
Activity.belongsTo(Tenant, { foreignKey: 'tenantId' });

Lead.hasMany(Activity, { foreignKey: 'leadId' });
Activity.belongsTo(Lead, { foreignKey: 'leadId' });

User.hasMany(Activity, { foreignKey: 'userId' });
Activity.belongsTo(User, { foreignKey: 'userId' });

Tenant.hasMany(Product, { foreignKey: 'tenantId' });
Product.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Employee, { foreignKey: 'tenantId' });
Employee.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Ticket, { foreignKey: 'tenantId' });
Ticket.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(CustomRole, { foreignKey: 'tenantId' });
CustomRole.belongsTo(Tenant, { foreignKey: 'tenantId' });

module.exports = {
  Tenant,
  User,
  Lead,
  Account,
  Activity,
  Product,
  Employee,
  Ticket,
  CustomRole,
  Quote,
  Proposal,
  Invoice,
  Task,
  Event
};
