const { prisma } = require('../config/db');
const { asyncHandler } = require('../middleware/errorHandler');
const twilio = require('twilio');

const handleIncomingCall = asyncHandler(async (req, res) => {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const twiml = new VoiceResponse();

  twiml.say('Hello. Welcome to our AI voice assistant. We are connecting you shortly.');
  // Future implementation: stream to OpenAI real-time API or other AI logic

  res.type('text/xml');
  res.status(200).send(twiml.toString());
});

const initiateOutboundCall = asyncHandler(async (req, res) => {
  const { to, leadId } = req.body;

  if (!to) {
    return res.status(400).json({ success: false, message: 'Phone number "to" is required.' });
  }

  if (leadId) {
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        organizationId: req.tenantId
      }
    });
    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found or access denied.' });
    }
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy';
  const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
  
  const client = twilio(accountSid, authToken);

  try {
    const call = await client.calls.create({
      url: `${req.protocol}://${req.get('host')}/api/voice/incoming`,
      to: to,
      from: twilioNumber
    });

    res.status(200).json({ success: true, callSid: call.sid });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate call.', error: error.message });
  }
});

module.exports = {
  handleIncomingCall,
  initiateOutboundCall
};
