const { prisma } = require('./config/db');
const bcrypt = require('bcryptjs');

const seedComprehensiveDatabase = async () => {
  try {
    console.log('--- STARTING COMPREHENSIVE SEEDING ---');
    
    // Clear out existing data
    console.log('Wiping existing database...');
    await prisma.activity.deleteMany({});
    await prisma.deal.deleteMany({});
    await prisma.contact.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.invoice.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.stage.deleteMany({});
    await prisma.pipeline.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.organization.deleteMany({});
    
    console.log('Generating completely fresh mock CRM data...');

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
        industry: 'E-Commerce',
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

    const company3 = await prisma.company.create({
      data: {
        organizationId: org.id,
        name: 'Apex Global Logistics',
        industry: 'Logistics',
        website: 'www.apexglobal.in',
        employees: 450,
        annualRevenue: 150000000.00
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

    const stage1 = await prisma.stage.create({ data: { pipelineId: pipeline.id, name: 'Lead In', position: 1, probability: 10 } });
    const stage2 = await prisma.stage.create({ data: { pipelineId: pipeline.id, name: 'Contacted', position: 2, probability: 30 } });
    const stage3 = await prisma.stage.create({ data: { pipelineId: pipeline.id, name: 'Qualified', position: 3, probability: 50 } });
    const stage4 = await prisma.stage.create({ data: { pipelineId: pipeline.id, name: 'Proposal Sent', position: 4, probability: 70 } });
    const stage5 = await prisma.stage.create({ data: { pipelineId: pipeline.id, name: 'Won', position: 5, probability: 100 } });

    // 5. Create Contacts
    const c1 = await prisma.contact.create({
      data: {
        organizationId: org.id,
        ownerId: admin.id,
        companyId: company1.id,
        firstName: 'Ankit',
        lastName: 'Mishra',
        email: 'ankit.mishra@kanrulifestyle.com',
        phone: '+919876543210',
        designation: 'CEO'
      }
    });

    const c2 = await prisma.contact.create({
      data: {
        organizationId: org.id,
        ownerId: salesRep.id,
        companyId: company2.id,
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha@nexustech.io',
        phone: '+919811223344',
        designation: 'CTO'
      }
    });

    // 6. Create Deals
    const deal1 = await prisma.deal.create({
      data: {
        organizationId: org.id,
        ownerId: admin.id,
        pipelineId: pipeline.id,
        stageId: stage4.id,
        companyId: company1.id,
        contactId: c1.id,
        title: 'E-Commerce Website Revamp',
        amount: 250000.00,
        currency: 'INR',
        probability: 70,
        status: 'In Progress'
      }
    });

    const deal2 = await prisma.deal.create({
      data: {
        organizationId: org.id,
        ownerId: salesRep.id,
        pipelineId: pipeline.id,
        stageId: stage2.id,
        companyId: company2.id,
        contactId: c2.id,
        title: 'Enterprise CRM Implementation',
        amount: 1500000.00,
        currency: 'INR',
        probability: 30,
        status: 'In Progress'
      }
    });

    // 7. Create Activities
    await prisma.activity.create({
      data: {
        organizationId: org.id,
        userId: admin.id,
        entityType: 'Deal',
        entityId: deal1.id,
        activityType: 'Note',
        description: 'Client is happy with the proposal. We need to follow up next Monday.'
      }
    });

    await prisma.activity.create({
      data: {
        organizationId: org.id,
        userId: salesRep.id,
        entityType: 'Contact',
        entityId: c2.id,
        activityType: 'Call',
        description: 'Initial discovery call completed. Need technical architecture review.'
      }
    });

    // 8. Create Invoices
    await prisma.invoice.create({
      data: {
        organizationId: org.id,
        clientName: 'Kanru Lifestyle Private Limited',
        amount: 59000.00,
        status: 'Paid',
        dueDate: '2026-08-01',
        gstType: 'CGST_SGST',
        gstRate: 18,
        baseAmount: 50000.00,
        gstAmount: 9000.00
      }
    });

    await prisma.invoice.create({
      data: {
        organizationId: org.id,
        clientName: 'Nexus Tech',
        amount: 118000.00,
        status: 'Unpaid',
        dueDate: '2026-08-30',
        gstType: 'IGST',
        gstRate: 18,
        baseAmount: 100000.00,
        gstAmount: 18000.00
      }
    });

    // 9. Generate Sample Leads
    const firstNames = ['Pankaj', 'Sonam', 'Pawan', 'Saksham', 'Amit', 'Rohan', 'Pooja', 'Neha'];
    const lastNames = ['Kumar', 'Sharma', 'Tiwari', 'Bhatnagar', 'Gupta', 'Singh', 'Verma', 'Joshi'];
    const statuses = ['New', 'Contacted', 'Proposal Sent', 'Qualified', 'Nurturing'];

    const leadPromises = [];
    for (let i = 1; i <= 25; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[i % lastNames.length];
      const status = statuses[i % statuses.length];
      
      leadPromises.push(prisma.lead.create({
        data: {
          organizationId: org.id,
          ownerId: i % 2 === 0 ? admin.id : salesRep.id,
          companyId: i % 3 === 0 ? company3.id : null,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@test.com`,
          phone: `+9198765${String(i).padStart(5, '0')}`,
          source: 'Website',
          status: status,
          score: Math.floor(Math.random() * 50) + 50,
          industry: 'Technology',
          city: 'Delhi',
          country: 'India'
        }
      }));
    }
    await Promise.all(leadPromises);

    console.log('--- COMPREHENSIVE SEEDING COMPLETED ---');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

seedComprehensiveDatabase().finally(() => prisma.$disconnect());
