const { asyncHandler } = require('../middleware/errorHandler');
const { whatsappQueue } = require('../queues/whatsappQueue');
const { prisma } = require('../config/db');
const socketService = require('../services/socketService');

// @desc    Dispatch a WhatsApp Message
// @route   POST /api/whatsapp/send
// @access  Private
const sendWhatsAppMessage = asyncHandler(async (req, res) => {
  const { phone, template, variables } = req.body;

  if (!phone || !template) {
    res.status(400);
    throw new Error('Phone and template are required');
  }

  // Push job to BullMQ queue
  const job = await whatsappQueue.add('sendTemplate', {
    phone,
    template,
    variables
  });

  res.status(202).json({
    success: true,
    message: 'WhatsApp message queued for dispatch',
    jobId: job.id
  });
});

// @desc    WhatsApp Webhook Receiver (Meta Cloud API)
// @route   POST /api/webhooks/whatsapp
// @access  Public
const whatsappWebhook = asyncHandler(async (req, res) => {
  const { body } = req;
  
  // Logic to process incoming messages or delivery statuses
  console.log('[WhatsApp Webhook] Received payload:', JSON.stringify(body, null, 2));

  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.value && change.value.messages) {
          for (const message of change.value.messages) {
            const fromNumber = message.from; // Phone number of the sender
            const textBody = message.text ? message.text.body : '';
            
            // Try to find the contact or lead to get the organizationId
            let organizationId = null;
            let contactId = null;
            let leadId = null;
            let ownerId = null;

            const contact = await prisma.contact.findFirst({
              where: { phone: fromNumber }
            });

            if (contact) {
              organizationId = contact.organizationId;
              contactId = contact.id;
              ownerId = contact.ownerId;
            } else {
              const lead = await prisma.lead.findFirst({
                where: { phone: fromNumber }
              });
              if (lead) {
                organizationId = lead.organizationId;
                leadId = lead.id;
                ownerId = lead.ownerId;
              }
            }

            if (organizationId) {
              // Save to Communication model
              const communication = await prisma.communication.create({
                data: {
                  organizationId,
                  contactId,
                  leadId,
                  ownerId,
                  type: 'WhatsApp',
                  direction: 'Inbound',
                  status: 'Completed',
                  content: textBody,
                  metadata: {
                    messageId: message.id,
                    from: fromNumber
                  }
                }
              });

              // Emit via WebSockets
              socketService.emitToOrganization(organizationId, 'new_whatsapp_message', communication);
            } else {
              console.log(`[WhatsApp Webhook] No matching contact or lead found for phone: ${fromNumber}`);
            }
          }
        }
      }
    }
  }

  // Meta expects a 200 OK immediately
  res.status(200).send('EVENT_RECEIVED');
});

// @desc    WhatsApp Webhook Verification (Meta Cloud API)
// @route   GET /api/webhooks/whatsapp
// @access  Public
const verifyWhatsAppWebhook = asyncHandler(async (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('[WhatsApp Webhook] Verified by Meta');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

module.exports = {
  sendWhatsAppMessage,
  whatsappWebhook,
  verifyWhatsAppWebhook
};
