const Razorpay = require('razorpay');
const crypto = require('crypto');
const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// @desc    Generate Razorpay Payment Link / Order for an Invoice
// @route   POST /api/invoices/:id/pay
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) {
    res.status(404);
    throw new Error('Invoice not found');
  }

  // Create Razorpay Order
  const options = {
    amount: Math.round(invoice.amount * 100), // Amount in paise
    currency: 'INR',
    receipt: `rcpt_${invoice.id.substring(0, 8)}`,
  };

  const order = await razorpay.orders.create(options);

  // Update invoice with order ID
  await prisma.invoice.update({
    where: { id },
    data: { razorpayOrderId: order.id }
  });

  res.status(200).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency
  });
});

// @desc    Razorpay Webhook Receiver
// @route   POST /api/webhooks/razorpay
// @access  Public
const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'vgrow_webhook_secret';
  
  // Verify signature
  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto.createHmac('sha256', secret)
                                  .update(JSON.stringify(req.body))
                                  .digest('hex');

  if (signature !== expectedSignature) {
    console.error('[Razorpay] Invalid Webhook Signature');
    return res.status(400).send('Invalid signature');
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured' || event === 'order.paid') {
    const payment = payload.payment.entity;
    const orderId = payment.order_id;

    console.log(`[Razorpay] Payment captured for Order: ${orderId}`);

    // Find invoice and mark as Paid
    const invoice = await prisma.invoice.findFirst({
      where: { razorpayOrderId: orderId }
    });

    if (invoice) {
      await prisma.invoice.update({
        where: { id: invoice.id },
        data: { 
          status: 'Paid',
          razorpayPaymentId: payment.id 
        }
      });
      console.log(`[Razorpay] Invoice ${invoice.id} marked as Paid.`);
    }
  }

  res.status(200).json({ status: 'ok' });
});

module.exports = {
  createRazorpayOrder,
  razorpayWebhook
};
