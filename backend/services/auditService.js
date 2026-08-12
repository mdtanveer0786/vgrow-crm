const { prisma } = require('../config/db');
const { logger } = require('../middleware/errorHandler');

class AuditService {
  /**
   * Log a critical action to the AuditLog table
   */
  static async logAction({ userId, orgId, action, target, metadata, ipAddress, userAgent }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          organizationId: orgId,
          action,
          target,
          metadata: metadata || {},
          ipAddress,
          userAgent
        }
      });
      logger.info({ userId, orgId, action, target }, 'Audit log created');
    } catch (error) {
      // We don't throw here to avoid failing the main business transaction,
      // but we log it as a critical error.
      logger.error({ error, userId, orgId, action }, 'Failed to write audit log');
    }
  }
}

module.exports = AuditService;
