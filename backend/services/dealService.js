const { prisma } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');
const AuditService = require('./auditService');

class DealService {
  /**
   * Get paginated and safely sorted deals
   */
  static async getDeals(orgId, user, { page = 1, limit = 50, sortBy = 'createdAt', sortDesc = 'true', search = '' }) {
    const skip = (page - 1) * limit;
    
    // Security: Only allow sorting by safe columns
    const allowedSortFields = ['createdAt', 'updatedAt', 'amount', 'status', 'title', 'expectedClose'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const orderDirection = sortDesc === 'true' ? 'desc' : 'asc';

    const where = {
      organizationId: orgId,
      deletedAt: null,
      ...(search && {
        title: { contains: search }
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

    const [total, deals] = await Promise.all([
      prisma.deal.count({ where }),
      prisma.deal.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { [safeSortBy]: orderDirection },
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, avatar: true } },
          company: { select: { id: true, name: true } },
          contact: { select: { id: true, firstName: true, lastName: true } },
          stage: { select: { id: true, name: true, probability: true } },
          pipeline: { select: { id: true, name: true } }
        }
      })
    ]);

    return {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      data: deals
    };
  }
}

module.exports = DealService;
