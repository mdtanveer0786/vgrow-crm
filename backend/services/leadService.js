const { prisma } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const AuditService = require('./auditService');

class LeadService {
  /**
   * Get paginated and safely sorted leads
   */
  static async getLeads(orgId, user, { page = 1, limit = 50, sortBy = 'createdAt', sortDesc = 'true', search = '' }) {
    const skip = (page - 1) * limit;
    
    // Security: Only allow sorting by safe columns
    const allowedSortFields = ['createdAt', 'updatedAt', 'score', 'status', 'name'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortDesc === 'true' ? 'desc' : 'asc';

    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...(search && {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ]
      })
    };

    // RBAC
    if (user.role === 'Manager') {
      const orConditions = [{ id: user.id }, { reportsTo: user.id }];
      if (user.teamId) {
        orConditions.push({ teamId: user.teamId });
      }
      const teamUsers = await prisma.user.findMany({
        where: { organizationId: orgId, OR: orConditions },
        select: { id: true }
      });
      where.ownerId = { in: teamUsers.map(u => u.id) };
    } else if (user.role !== 'Admin') {
      where.ownerId = user.id;
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { [safeSortBy]: orderDirection },
        include: {
          owner: { select: { id: true, firstName: true, lastName: true } }
        }
      })
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: leads
    };
  }

  /**
   * Create a new lead
   */
  static async createLead(orgId, userId, leadData) {
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        organizationId: orgId,
        ownerId: leadData.ownerId || userId,
      }
    });

    // Audit Log
    await AuditService.logAction({
      userId,
      orgId,
      action: 'lead.created',
      target: `Lead:${lead.id}`,
      metadata: { leadId: lead.id, leadName: lead.name }
    });

    return lead;
  }

  /**
   * Delete a lead safely
   */
  static async deleteLead(orgId, userId, leadId) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, organizationId: orgId }
    });

    if (!lead) {
      throw new AppError('Lead not found or unauthorized', 404);
    }

    await prisma.lead.delete({
      where: { id: leadId }
    });

    await AuditService.logAction({
      userId,
      orgId,
      action: 'lead.deleted',
      target: `Lead:${leadId}`,
      metadata: { leadName: lead.name }
    });

    return true;
  }
}

module.exports = LeadService;
