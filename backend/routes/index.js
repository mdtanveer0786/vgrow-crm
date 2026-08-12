const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const leadController = require('../controllers/leadController');
const accountController = require('../controllers/accountController');
const activityController = require('../controllers/activityController');
const moduleController = require('../controllers/moduleController');
const contactController = require('../controllers/contactController');
const dealController = require('../controllers/dealController');
const pipelineController = require('../controllers/pipelineController');
const communicationController = require('../controllers/communicationController');
const productController = require('../controllers/productController');
const quoteController = require('../controllers/quoteController');
const proposalController = require('../controllers/proposalController');
const customModuleController = require('../controllers/customModuleController');
const automationController = require('../controllers/automationController');
const knowledgeController = require('../controllers/knowledgeController');
const campaignController = require('../controllers/campaignController');
const callController = require('../controllers/callController');


// Import authentication middleware
const { protect, authorize } = require('../middleware/authMiddleware');

// 1. AUTHENTICATION & MULTI-TENANCY
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/logout', authController.logoutUser);
router.get('/auth/me', protect, authController.getUserProfile);

// 1. DASHBOARD
router.get('/dashboard', protect, dashboardController.getDashboard);
router.get('/analytics/ai-forecast', protect, dashboardController.getAIForecast);

// 2. LEADS
router.get('/leads', protect, leadController.getLeads);
router.post('/leads', protect, leadController.createLead);
router.put('/leads/:id', protect, leadController.updateLead);
router.delete('/leads/:id', protect, leadController.deleteLead);
router.get('/leads/:id/ai-insights', protect, leadController.getLeadAIInsights);

// 3. ACCOUNTS / COMPANIES
router.get('/accounts', protect, accountController.getAccounts);
router.post('/accounts', protect, accountController.createAccount);

// MULTI-TENANT BRANDING
router.get('/organizations/branding', accountController.getBranding);

// 4. CONTACTS
router.get('/contacts', protect, contactController.getContacts);
router.get('/contacts/:id', protect, contactController.getContact);
router.post('/contacts', protect, contactController.createContact);
router.put('/contacts/:id', protect, contactController.updateContact);
router.delete('/contacts/:id', protect, contactController.deleteContact);

// 5. DEALS
router.get('/deals', protect, dealController.getDeals);
router.get('/deals/:id', protect, dealController.getDeal);
router.post('/deals', protect, dealController.createDeal);
router.put('/deals/:id', protect, dealController.updateDeal);
router.put('/deals/:id/move-stage', protect, dealController.moveStage);
router.delete('/deals/:id', protect, dealController.deleteDeal);

// 6. PIPELINES & STAGES
router.get('/pipelines', protect, pipelineController.getPipelines);
router.post('/pipelines', protect, authorize('Admin', 'Owner', 'Manager'), pipelineController.createPipeline);
router.post('/pipelines/:pipelineId/stages', protect, authorize('Admin', 'Owner', 'Manager'), pipelineController.createStage);
router.put('/stages/:id', protect, authorize('Admin', 'Owner', 'Manager'), pipelineController.updateStage);
router.delete('/stages/:id', protect, authorize('Admin', 'Owner', 'Manager'), pipelineController.deleteStage);

// 7. ACTIVITIES
router.get('/activities', protect, activityController.getActivities);
router.post('/activities', protect, activityController.createActivity);

// 8. PRODUCTS
router.get('/products', protect, productController.getProducts);
router.get('/products/:id', protect, productController.getProductById);
router.post('/products', protect, authorize('Admin', 'Owner'), productController.createProduct);
router.put('/products/:id', protect, authorize('Admin', 'Owner'), productController.updateProduct);
router.delete('/products/:id', protect, authorize('Admin', 'Owner'), productController.deleteProduct);

// 9. SETTINGS
router.get('/settings', protect, moduleController.getSettings);
router.put('/settings', protect, authorize('Admin', 'Owner'), moduleController.updateSettings);

// 10. EMPLOYEES / USERS
router.get('/employees', protect, moduleController.getEmployees);
router.post('/employees', protect, authorize('Admin', 'Owner'), moduleController.createEmployee);
router.put('/employees/:id', protect, authorize('Admin', 'Owner'), moduleController.updateEmployee);
router.delete('/employees/:id', protect, authorize('Admin', 'Owner'), moduleController.deleteEmployee);

// 11. TICKETS
router.get('/tickets', protect, moduleController.getTickets);
router.post('/tickets', protect, moduleController.createTicket);
router.put('/tickets/:id', protect, moduleController.updateTicket);
router.delete('/tickets/:id', protect, moduleController.deleteTicket);

// 12. ROLES
router.get('/roles', protect, moduleController.getRoles);
router.post('/roles', protect, authorize('Admin', 'Owner'), moduleController.createRole);

// 13. QUOTES
router.get('/quotes', protect, quoteController.getQuotes);
router.get('/quotes/:id', protect, quoteController.getQuoteById);
router.post('/quotes', protect, quoteController.createQuote);
router.put('/quotes/:id', protect, quoteController.updateQuote);
router.delete('/quotes/:id', protect, quoteController.deleteQuote);

// 14. PROPOSALS
router.get('/proposals', protect, proposalController.getProposals);
router.get('/proposals/:id', protect, proposalController.getProposalById);
router.post('/proposals', protect, proposalController.createProposal);
router.put('/proposals/:id', protect, proposalController.updateProposal);
router.delete('/proposals/:id', protect, proposalController.deleteProposal);
router.post('/proposals/:id/sign', protect, proposalController.signProposal);

// 15. INVOICES
router.get('/invoices', protect, moduleController.getInvoices);
router.post('/invoices', protect, moduleController.createInvoice);

// 16. TASKS
router.get('/tasks', protect, moduleController.getTasks);
router.post('/tasks', protect, moduleController.createTask);

// 17. EVENTS (Calendar)
router.get('/events', protect, moduleController.getEvents);
router.post('/events', protect, moduleController.createEvent);

// 18. COMMUNICATIONS (Unified Inbox)
router.get('/communications', protect, communicationController.getCommunications);
router.get('/communications/:id', protect, communicationController.getCommunicationById);
router.post('/communications', protect, communicationController.createCommunication);
router.put('/communications/:id/status', protect, communicationController.updateCommunicationStatus);
router.delete('/communications/:id', protect, communicationController.deleteCommunication);

// 19. GLOBAL SEARCH ENGINE
const searchController = require('../controllers/searchController');
router.get('/search', protect, searchController.globalSearch);

// 20. RAZORPAY BILLING HUB
const paymentsController = require('../controllers/paymentsController');
router.post('/payments/webhook', paymentsController.receiveRazorpayWebhook);
router.post('/invoices/:id/payment-link', protect, paymentsController.generatePaymentLink);
router.get('/payments/links', protect, paymentsController.getPaymentLinks);
router.post('/payments/links/:id/cancel', protect, paymentsController.cancelPaymentLink);
router.get('/payments/subscriptions', protect, paymentsController.getSubscriptions);
router.post('/payments/subscriptions', protect, paymentsController.createSubscription);
router.post('/payments/subscriptions/:id/cancel', protect, paymentsController.cancelSubscription);
router.get('/payments/mock-checkout/:id', paymentsController.renderMockCheckout);
router.post('/payments/mock-success/:id', paymentsController.handleMockSuccess);

// 21. AI NATIVE COPILOT & SCORE PREDICTOR
const aiController = require('../controllers/aiController');
router.post('/ai/copilot', protect, aiController.processCopilotQuery);
router.post('/ai/predictive-score', protect, aiController.calculatePredictiveScore);
router.post('/ai/draft-reply', protect, aiController.generateDraftReply);

const { createRazorpayOrder, razorpayWebhook } = require('../controllers/razorpayController');
const { sendWhatsAppMessage, whatsappWebhook, verifyWhatsAppWebhook } = require('../controllers/whatsappController');

// ── RAZORPAY INTEGRATION (Step 10) ──
router.post('/invoices/:id/pay', protect, createRazorpayOrder);
router.post('/webhooks/razorpay', razorpayWebhook);

const webhookController = require('../controllers/webhookController');

// ── WHATSAPP INTEGRATION (Step 7) ──
router.post('/whatsapp/send', protect, sendWhatsAppMessage);
router.post('/webhooks/whatsapp', whatsappWebhook);
router.get('/webhooks/whatsapp', verifyWhatsAppWebhook);

// ── INDIAMART & JUSTDIAL WEBHOOKS ──
router.post('/webhooks/indiamart', webhookController.indiamartWebhook);
router.post('/webhooks/justdial', webhookController.justdialWebhook);

// ── FILE STORAGE (Step 11) ──
const upload = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');

router.post('/upload', protect, upload.single('file'), fileController.uploadFile);
router.get('/files/:entityType/:entityId', protect, fileController.getAttachments);
router.post('/users/:id/avatar', protect, upload.single('file'), fileController.updateUserAvatar);

// 16. CUSTOM MODULES
router.get('/custom-modules', protect, moduleController.getCustomModules);
router.get('/custom-modules/:id', protect, customModuleController.getCustomModuleById);
router.post('/custom-modules', protect, authorize('Admin', 'Owner'), moduleController.createCustomModule);
router.put('/custom-modules/:id', protect, authorize('Admin', 'Owner'), customModuleController.updateCustomModule);
router.delete('/custom-modules/:id', protect, authorize('Admin', 'Owner'), customModuleController.deleteCustomModule);

router.get('/custom-modules/:moduleId/records', protect, moduleController.getCustomRecords);
router.post('/custom-modules/:moduleId/records', protect, moduleController.createCustomRecord);
router.put('/custom-modules/:moduleId/records/:recordId', protect, customModuleController.updateCustomRecord);
router.delete('/custom-modules/:moduleId/records/:recordId', protect, customModuleController.deleteCustomRecord);

// 17. AUTOMATIONS
router.get('/automations', protect, automationController.getAutomations);
router.post('/automations', protect, authorize('Admin', 'Owner'), automationController.createAutomation);
router.put('/automations/:id', protect, authorize('Admin', 'Owner'), automationController.updateAutomation);
router.delete('/automations/:id', protect, authorize('Admin', 'Owner'), automationController.deleteAutomation);

// 18. KNOWLEDGE BASE
router.get('/knowledge', protect, knowledgeController.getArticles);
router.post('/knowledge', protect, authorize('Admin', 'Owner'), knowledgeController.createArticle);
router.put('/knowledge/:id', protect, authorize('Admin', 'Owner'), knowledgeController.updateArticle);
router.delete('/knowledge/:id', protect, authorize('Admin', 'Owner'), knowledgeController.deleteArticle);

// 19. HELLOMAIL CAMPAIGNS
router.get('/campaigns', protect, campaignController.getCampaigns);
router.post('/campaigns', protect, authorize('Admin', 'Owner', 'Manager'), campaignController.createCampaign);

// 20. TELEPHONY CALL LOGS
router.get('/calls', protect, callController.getCallLogs);
router.post('/calls', protect, callController.createCallLog);
router.post('/calls/:id/summarize', protect, callController.summarizeCall);

// 21. AI VOICE AGENTS (TWILIO)
const voiceController = require('../controllers/voiceController');
router.post('/voice/incoming', voiceController.handleIncomingCall);
router.post('/voice/outbound', protect, voiceController.initiateOutboundCall);

module.exports = router;
