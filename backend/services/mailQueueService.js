const { prisma } = require('../config/db');

/**
 * Triggers background processing of emails for a campaign.
 * Automatically mocks sending emails to all active organization leads.
 */
const processCampaignQueue = async (campaignId, orgId) => {
  try {
    const leads = await prisma.lead.findMany({
      where: { organizationId: orgId, deletedAt: null }
    });

    if (leads.length === 0) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { status: 'Empty' }
      });
      return;
    }

    // Set Campaign status to Processing
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'Processing', sentCount: leads.length }
    });

    // Create logs for each mail dispatched
    for (const lead of leads) {
      if (!lead.email) continue;
      
      await prisma.campaignMailLog.create({
        data: {
          campaignId,
          email: lead.email,
          status: 'Sent'
        }
      });

      // Log activity to lead profile
      await prisma.activity.create({
        data: {
          organizationId: orgId,
          entityId: lead.id,
          entityType: 'Lead',
          activityType: 'Email',
          description: `Marketing campaign mail dispatched. Campaign ID: ${campaignId.slice(0, 8)}`
        }
      });
    }

    // Simulate marketing analytics changes after 5 seconds (mock opens and clicks)
    setTimeout(async () => {
      try {
        const opens = Math.floor(leads.length * 0.7); // 70% open rate
        const clicks = Math.floor(leads.length * 0.3); // 30% click rate

        await prisma.campaign.update({
          where: { id: campaignId },
          data: {
            status: 'Completed',
            opens,
            clicks
          }
        });
        
        console.log(`[Campaign Queue] Schedulers completed campaign: ${campaignId}`);
      } catch (err) {
        console.error('[Campaign Background Schedulers Error]', err);
      }
    }, 5000);

  } catch (error) {
    console.error('[Campaign Queue Processing Failed]', error);
    await prisma.campaign.update({
      where: { id: campaignId },
      data: { status: 'Failed' }
    });
  }
};

module.exports = {
  processCampaignQueue
};
