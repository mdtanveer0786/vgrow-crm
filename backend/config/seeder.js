const { prisma } = require('./db');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    // Check if database has already been seeded to avoid duplicates
    const orgCount = await prisma.organization.count();
    if (orgCount > 0) {
      console.log('Database already has data. Skipping seeder.');
      return;
    }

    console.log('Seeding database with fresh mock CRM data (100 leads)...');

    // 1. Create a Default Organization
    const org = await prisma.organization.create({
      data: {
        name: 'Discover First Step Private Limited',
        slug: 'firststepedu-net',
        logo: '',
        timezone: 'Asia/Kolkata',
        language: 'en',
        currency: 'INR',
        status: 'Active'
      }
    });

    // Hash password "password123"
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 2. Create Users
    const admin = await prisma.user.create({
      data: {
        organizationId: org.id,
        firstName: 'Vaibhav',
        lastName: 'Gupta',
        email: 'vaibhav@vgrow.com',
        passwordHash: passwordHash,
        status: 'Active'
      }
    });

    const salesRep = await prisma.user.create({
      data: {
        organizationId: org.id,
        firstName: 'Karan',
        lastName: 'Sharma',
        email: 'karan@vgrow.com',
        passwordHash: passwordHash,
        status: 'Active'
      }
    });

    // 3. Create Companies
    const company1 = await prisma.company.create({
      data: {
        organizationId: org.id,
        name: 'Kanru Lifestyle Private Limited',
        industry: 'Lifestyle & E-Commerce',
        website: 'www.kanrulifestyle.com',
        employees: 25,
        annualRevenue: 5000000.00
      }
    });

    const company2 = await prisma.company.create({
      data: {
        organizationId: org.id,
        name: 'Nexus Tech',
        industry: 'Software',
        website: 'www.nexustech.io',
        employees: 120,
        annualRevenue: 25000000.00
      }
    });

    // 4. Create default pipeline and stages
    const pipeline = await prisma.pipeline.create({
      data: {
        organizationId: org.id,
        name: 'Sales Pipeline',
        isDefault: true
      }
    });

    const stage1 = await prisma.stage.create({
      data: { pipelineId: pipeline.id, name: 'Lead Generated', position: 1, probability: 10 }
    });
    const stage2 = await prisma.stage.create({
      data: { pipelineId: pipeline.id, name: 'Contacted', position: 2, probability: 30 }
    });
    const stage3 = await prisma.stage.create({
      data: { pipelineId: pipeline.id, name: 'Proposal Sent', position: 3, probability: 70 }
    });
    const stage4 = await prisma.stage.create({
      data: { pipelineId: pipeline.id, name: 'Closed Won', position: 4, probability: 100 }
    });

    // 5. Create 100 Sample Leads dynamically
    const firstNames = ['Pankaj', 'Sonam', 'Pawan', 'Saksham', 'Amit', 'Rohan', 'Pooja', 'Neha', 'Vikram', 'Anjali', 'Karan', 'Aditi', 'Rajesh', 'Suresh', 'Ramesh', 'Alok', 'Deepak', 'Vijay', 'Sanjay', 'Sunita'];
    const lastNames = ['Kumar', 'Sharma', 'Tiwari', 'Bhatnagar', 'Gupta', 'Singh', 'Verma', 'Joshi', 'Mehta', 'Nair', 'Patel', 'Reddy', 'Chawla', 'Malhotra', 'Bose', 'Sen', 'Das', 'Mishra', 'Pandey', 'Saxena'];
    const industries = ['Retail', 'Apparel', 'Logistics', 'Consulting', 'Manufacturing', 'Technology', 'Finance', 'Healthcare', 'Education', 'Real Estate'];
    const statuses = ['New', 'Contacted', 'Proposal Sent', 'Qualified', 'Nurturing'];

    console.log('Generating 100 leads...');
    const leadPromises = [];
    for (let i = 1; i <= 100; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const status = statuses[i % statuses.length];
      const ind = industries[i % industries.length];
      const score = Math.floor(Math.random() * 50) + 50;

      leadPromises.push(prisma.lead.create({
        data: {
          organizationId: org.id,
          ownerId: i % 2 === 0 ? admin.id : salesRep.id,
          companyId: i % 5 === 0 ? company1.id : (i % 7 === 0 ? company2.id : null),
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@vgrow.com`,
          phone: `+9198765${String(i).padStart(5, '0')}`,
          source: 'Manual',
          status: status,
          score: score,
          industry: ind,
          city: i % 3 === 0 ? 'Mumbai' : (i % 3 === 1 ? 'Delhi' : 'Bangalore'),
          state: i % 3 === 0 ? 'Maharashtra' : (i % 3 === 1 ? 'Delhi' : 'Karnataka'),
          country: 'India'
        }
      }));
    }
    await Promise.all(leadPromises);

    // 6. Create Roles and RBAC permissions
    const managerRole = await prisma.role.create({
      data: {
        organizationId: org.id,
        name: 'Manager',
        description: 'Can view and assign leads'
      }
    });

    console.log('Database seeded successfully with 100 leads.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
