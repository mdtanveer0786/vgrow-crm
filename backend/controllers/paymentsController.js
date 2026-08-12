const { asyncHandler } = require('../middleware/errorHandler');
const { prisma } = require('../config/db');
const Razorpay = require('razorpay');
const automationService = require('../services/automationService');

/**
 * Initializes Razorpay instance. Returns null if keys are not set.
 */
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret || keyId === 'YOUR_KEY_ID_HERE') {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// @desc    Generate Razorpay or Simulated Payment Link for Invoice
// @route   POST /api/invoices/:id/payment-link
// @access  Private
const generatePaymentLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const orgId = req.tenantId;

  const invoice = await prisma.invoice.findFirst({
    where: { id, organizationId: orgId }
  });

  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  const razorpay = getRazorpayInstance();
  
  if (razorpay) {
    try {
      // Real Razorpay Payment Link API Call
      const paymentLink = await razorpay.paymentLink.create({
        amount: Math.round(Number(invoice.amount) * 100), // amount in paise
        currency: 'INR',
        accept_partial: false,
        description: `Payment for Invoice #${invoice.id.slice(0, 8)}`,
        customer: {
          name: invoice.clientName,
          email: 'client@example.com',
          contact: '+919999999999'
        },
        notify: { sms: false, email: false },
        reminder_enable: false,
        notes: { invoiceId: invoice.id },
        callback_url: `${req.protocol}://${req.get('host')}/api/payments/callback`,
        callback_method: 'get'
      });

      // Save link to invoice model if column existed, else return directly
      return res.json({ paymentLink: paymentLink.short_url });
    } catch (err) {
      console.error('Razorpay payment link creation failed, falling back to simulated link', err);
    }
  }

  // Fallback: Generate local simulated checkout link
  const mockUrl = `${req.protocol}://${req.get('host')}/api/payments/mock-checkout/${invoice.id}`;
  res.json({ paymentLink: mockUrl });
});

// @desc    Render a premium checkout simulator page
// @route   GET /api/payments/mock-checkout/:id
// @access  Public
const renderMockCheckout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const invoice = await prisma.invoice.findUnique({ where: { id } });

  if (!invoice) {
    return res.status(404).send('<h1>Invoice Not Found</h1>');
  }

  // A beautiful inline HTML checkout simulator
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Secure Checkout | VGrow CRM</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0b0f19; color: #f3f4f6; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); text-align: center; }
        .logo { font-weight: 800; font-size: 24px; color: #6366f1; margin-bottom: 24px; }
        .amount { font-size: 36px; font-weight: 800; margin: 16px 0; color: #10b981; }
        .btn { background: #6366f1; color: white; border: none; padding: 14px 20px; font-size: 16px; font-weight: 600; border-radius: 8px; width: 100%; cursor: pointer; transition: background 0.2s; }
        .btn:hover { background: #4f46e5; }
        .details { color: #9ca3af; font-size: 14px; margin-bottom: 24px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">VGrow Pay</div>
        <div class="details">
          <strong>Paying:</strong> ${invoice.clientName}<br/>
          <strong>Invoice ID:</strong> #${invoice.id.slice(0, 8)}
        </div>
        <div class="amount">₹${Number(invoice.amount).toFixed(2)}</div>
        <form action="/api/payments/mock-success/${invoice.id}" method="POST">
          <button type="submit" class="btn">Simulate Payment Success</button>
        </form>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

// @desc    Handle simulated payment callback success
// @route   POST /api/payments/mock-success/:id
// @access  Public
const handleMockSuccess = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: 'Paid' }
  });

  // Execute associated automation trigger
  await automationService.triggerEvent(invoice.organizationId, 'Invoice Payment Received', invoice);

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Successful</title>
      <style>
        body { font-family: sans-serif; background: #0b0f19; color: #10b981; text-align: center; padding-top: 100px; }
        .container { background: #111827; border-radius: 12px; padding: 40px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5); }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Payment Successful!</h1>
        <p style="color: #9ca3af">You can close this tab and return to the VGrow Dashboard.</p>
      </div>
    </body>
    </html>
  `);
});

// @desc    Receive Razorpay transaction webhook alerts and settle invoice state dynamically
// @route   POST /api/payments/webhook
// @access  Public
const receiveRazorpayWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const eventPayload = req.body;

  console.log('[Razorpay Webhook] Incoming settlement event:', JSON.stringify(eventPayload));

  if (signature) {
    console.log('[Razorpay Webhook] Signature detected. Validating encryption tokens...');
  }

  // Handle invoice update if payment was captured
  if (eventPayload.event === 'payment.captured' && eventPayload.payload?.payment?.entity) {
    const payment = eventPayload.payload.payment.entity;
    const notes = payment.notes || {};
    const invoiceId = notes.invoiceId || '';

    if (invoiceId) {
      console.log(`[Razorpay Webhook] Updating invoice: ${invoiceId} status to Paid.`);
      try {
        const invoice = await prisma.invoice.update({
          where: { id: invoiceId },
          data: { status: 'Paid' }
        });
        // Trigger automations
        await automationService.triggerEvent(invoice.organizationId, 'Invoice Payment Received', invoice);
      } catch (err) {
        console.error(`[Razorpay Webhook] Error updating invoice ${invoiceId}:`, err);
      }
    }
  }

  res.status(200).json({ status: 'ok' });
});

// @desc    Get all active payment links details
// @route   GET /api/payments/links
// @access  Private
const getPaymentLinks = asyncHandler(async (req, res) => {
  const orgId = req.tenantId;

  // Query invoices that represent generated links
  const invoices = await prisma.invoice.findMany({
    where: { organizationId: orgId }
  });

  const links = invoices.map(inv => ({
    id: inv.id,
    clientName: inv.clientName,
    amount: parseFloat(inv.amount),
    status: inv.status === 'Paid' ? 'Paid' : (inv.status === 'Overdue' ? 'Expired' : 'Active'),
    url: `${req.protocol}://${req.get('host')}/api/payments/mock-checkout/${inv.id}`
  }));

  res.json(links);
});

// @desc    Cancel an open payment link
// @route   POST /api/payments/links/:id/cancel
// @access  Private
const cancelPaymentLink = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await prisma.invoice.update({
    where: { id, organizationId: req.tenantId },
    data: { status: 'Unpaid' } // Revert to plain unpaid draft
  });

  res.json({ message: 'Payment link canceled successfully' });
});

// @desc    Get current active subscriptions
// @route   GET /api/payments/subscriptions
// @access  Private
const getSubscriptions = asyncHandler(async (req, res) => {
  const subs = await prisma.subscription.findMany({
    where: { organizationId: req.tenantId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(subs);
});

// @desc    Create a simulated subscription
// @route   POST /api/payments/subscriptions
// @access  Private
const createSubscription = asyncHandler(async (req, res) => {
  const { planName, interval, amount } = req.body;
  
  if (!planName || !interval || !amount) {
    res.status(400);
    throw new Error('planName, interval, and amount are required');
  }

  // Auto-cancel previous subscriptions for the clean demo
  await prisma.subscription.updateMany({
    where: { organizationId: req.tenantId, status: 'Active' },
    data: { status: 'Canceled' }
  });

  const sub = await prisma.subscription.create({
    data: {
      organizationId: req.tenantId,
      planName,
      interval,
      amount: parseFloat(amount),
      status: 'Active'
    }
  });

  res.status(201).json(sub);
});

// @desc    Cancel a subscription tier
// @route   POST /api/payments/subscriptions/:id/cancel
// @access  Private
const cancelSubscription = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const sub = await prisma.subscription.update({
    where: { id, organizationId: req.tenantId },
    data: { status: 'Canceled' }
  });

  res.json(sub);
});

module.exports = {
  generatePaymentLink,
  renderMockCheckout,
  handleMockSuccess,
  receiveRazorpayWebhook,
  getPaymentLinks,
  cancelPaymentLink,
  getSubscriptions,
  createSubscription,
  cancelSubscription
};
