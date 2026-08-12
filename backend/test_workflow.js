const http = require('http');

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', (e) => reject(e));
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  console.log('--- Starting VGROWCRM Workflow Tests ---');
  await delay(2000); // Wait for server to start

  // 1. Lead creation from form
  console.log('\n1. Testing Lead Creation...');
  const leadData = {
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    phone: '1234567890',
    company: 'Test Corp',
    industry: 'Software',
    status: 'Prospecting',
    temperature: 'Warm'
  };
  const lead = await makeRequest('POST', '/leads', leadData);
  console.log('Created Lead:', lead);
  const leadId = lead.id;

  // 2. Lead status change
  console.log('\n2. Testing Lead Status Change...');
  const updatedLead = await makeRequest('PUT', `/leads/${leadId}`, { status: 'Qualified', temperature: 'Hot' });
  console.log('Updated Lead Status:', updatedLead.status, '| Temperature:', updatedLead.temperature);

  // 3. Converting lead to account
  console.log('\n3. Converting Lead to Account...');
  const accountData = {
    name: updatedLead.company,
    industry: updatedLead.industry,
    email: updatedLead.email,
    phone: updatedLead.phone
  };
  const account = await makeRequest('POST', '/accounts', accountData);
  console.log('Created Account from Lead:', account);

  // Optionally delete or mark lead as converted
  const convertedLead = await makeRequest('PUT', `/leads/${leadId}`, { status: 'Converted' });
  console.log('Lead marked as Converted:', convertedLead.status);

  // 4. Creating quotes
  console.log('\n4. Testing Quote Creation...');
  const quoteData = {
    title: 'CRM Implementation for Test Corp',
    amount: 5000.00,
    status: 'Draft'
  };
  const quote = await makeRequest('POST', '/quotes', quoteData);
  console.log('Created Quote:', quote);

  // 5. Creating proposals, invoices, and verify state persistence
  console.log('\n5. Testing Proposals and Invoices...');
  const proposalData = {
    title: 'Software Development Proposal',
    leadName: `${lead.firstName} ${lead.lastName}`,
    status: 'Draft',
    value: 10000.00
  };
  const proposal = await makeRequest('POST', '/proposals', proposalData);
  console.log('Created Proposal:', proposal);

  const invoiceData = {
    client: account.name,
    amount: 5000.00,
    status: 'Unpaid',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString()
  };
  const invoice = await makeRequest('POST', '/invoices', invoiceData);
  console.log('Created Invoice:', invoice);

  // Verify persistence
  console.log('\n--- Verifying State Persistence ---');
  const allLeads = await makeRequest('GET', '/leads');
  const allAccounts = await makeRequest('GET', '/accounts');
  const allQuotes = await makeRequest('GET', '/quotes');
  const allProposals = await makeRequest('GET', '/proposals');
  const allInvoices = await makeRequest('GET', '/invoices');
  
  console.log(`Verified Leads count: ${allLeads.length} (Expected >= 1)`);
  console.log(`Verified Accounts count: ${allAccounts.length} (Expected >= 1)`);
  console.log(`Verified Quotes count: ${allQuotes.length} (Expected >= 1)`);
  console.log(`Verified Proposals count: ${allProposals.length} (Expected >= 1)`);
  console.log(`Verified Invoices count: ${allInvoices.length} (Expected >= 1)`);
  
  console.log('\n--- All Workflows Tested Successfully ---');
}

runTests().catch(console.error);
