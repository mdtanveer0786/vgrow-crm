const { prisma } = require('../config/db');

/**
 * Triggers an event and executes any matching active automation rules.
 * 
 * @param {string} organizationId 
 * @param {string} eventName (e.g. 'Lead Created', 'Lead Status Changed to Qualified')
 * @param {object} entity (e.g. the created lead or ticket object)
 */
const triggerEvent = async (organizationId, eventName, entity) => {
  try {
    // 1. Find active rules for this event
    const activeRules = await prisma.automationRule.findMany({
      where: {
        organizationId,
        trigger: eventName,
        active: true
      }
    });

    if (!activeRules.length) return;

    // 2. Execute each matched rule
    for (const rule of activeRules) {
      console.log(`[AUTOMATION EXECUTOR] Event '${eventName}' triggered rule '${rule.name}' for Org ${organizationId}`);
      
      // Determine what to log on the timeline based on the action
      let activityDesc = `Automation '${rule.name}' executed action: ${rule.action}.`;
      
      // We log to the Activity timeline for the specific entity if it has an ID
      if (entity && entity.id) {
        await prisma.activity.create({
          data: {
            organizationId,
            entityType: getEntityType(eventName),
            entityId: entity.id,
            activityType: 'Automation',
            description: activityDesc,
            createdAt: new Date()
          }
        });
      }
      
      // Mock execution of the actual action
      await executeAction(rule.action, entity);
    }
  } catch (err) {
    console.error('[AUTOMATION EXECUTOR ERROR]', err);
  }
};

const getEntityType = (eventName) => {
  if (eventName.includes('Lead')) return 'Lead';
  if (eventName.includes('Ticket')) return 'Ticket';
  if (eventName.includes('Invoice')) return 'Invoice';
  return 'System';
};

const executeAction = async (action, entity) => {
  // Mock external service calls
  switch (action) {
    case 'Send WhatsApp Welcome Message':
      console.log(`-> MOCK WHATSAPP API: Sent Welcome template to Lead ID ${entity.id}`);
      break;
    case 'Send Email Draft "Intro Video"':
      console.log(`-> MOCK SMTP API: Queued Email 'Intro Video' to Lead ID ${entity.id}`);
      break;
    case 'Assign to Manager & Send Alert':
      console.log(`-> MOCK ALERT: Alerting Manager for Ticket ID ${entity.id}`);
      break;
    case 'Create Follow-up Task':
      console.log(`-> SYSTEM: Creating Follow-up task for ID ${entity.id}`);
      break;
    default:
      console.log(`-> SYSTEM: Executed generic action: ${action}`);
  }
};

module.exports = {
  triggerEvent
};
