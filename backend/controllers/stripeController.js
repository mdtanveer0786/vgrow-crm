const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_123');
const { prisma } = require('../config/db');

exports.createCheckoutSession = async (req, res, next) => {
  try {
    const { planName, interval, priceId } = req.body;
    const organizationId = req.user.organizationId; // From protect middleware

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: req.user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/settings`,
      client_reference_id: organizationId,
      metadata: { planName, interval }
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};

exports.stripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const organizationId = session.client_reference_id;
      const { planName, interval } = session.metadata;

      // Upsert Subscription
      await prisma.subscription.create({
        data: {
          organizationId,
          planName,
          interval,
          amount: session.amount_total / 100, // Amount in dollars/INR
          status: 'Active',
          stripeCustomerId: session.customer,
          stripeSubscriptionId: session.subscription,
        }
      });
    }
    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

exports.createPortalSession = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const subscription = await prisma.subscription.findFirst({
      where: { organizationId, status: 'Active' },
      orderBy: { createdAt: 'desc' }
    });

    if (!subscription || !subscription.stripeCustomerId) {
      return res.status(404).json({ message: 'No active Stripe subscription found.' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.CLIENT_URL}/settings`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    next(error);
  }
};
