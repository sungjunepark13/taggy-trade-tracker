import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// All household routes require authentication
router.use(authenticateToken);

/**
 * GET /api/household
 * Get household data for the authenticated user
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const household = await prisma.household.findUnique({
      where: { userId: req.user.userId },
      include: {
        incomePlan: true,
        spendingPlan: true,
        debts: {
          where: { archived: false },
          orderBy: { apr: 'desc' }
        },
        cashPlan: true,
        homeGoal: true,
        retireGoal: true,
        policies: true,
        scenarios: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!household) {
      res.status(404).json({ error: 'Household not found. Please complete setup.' });
      return;
    }

    res.json({ household });
  } catch (error) {
    console.error('Get household error:', error);
    res.status(500).json({ error: 'An error occurred while fetching household data' });
  }
});

/**
 * POST /api/household
 * Create or update household data for the authenticated user
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const {
      filingStatus,
      location,
      riskNote,
      sleepScore,
      members,
      incomePlan,
      spendingPlan,
      debts,
      cashPlan,
      homeGoal,
      retireGoal,
      policies
    } = req.body;

    // Check if household already exists
    const existingHousehold = await prisma.household.findUnique({
      where: { userId: req.user.userId }
    });

    let household;

    if (existingHousehold) {
      // Update existing household
      household = await prisma.household.update({
        where: { userId: req.user.userId },
        data: {
          filingStatus,
          location,
          riskNote,
          sleepScore,
          members,
          incomePlan: incomePlan ? {
            upsert: {
              create: incomePlan,
              update: incomePlan
            }
          } : undefined,
          spendingPlan: spendingPlan ? {
            upsert: {
              create: spendingPlan,
              update: spendingPlan
            }
          } : undefined,
          cashPlan: cashPlan ? {
            upsert: {
              create: cashPlan,
              update: cashPlan
            }
          } : undefined,
          homeGoal: homeGoal ? {
            upsert: {
              create: homeGoal,
              update: homeGoal
            }
          } : undefined,
          retireGoal: retireGoal ? {
            upsert: {
              create: retireGoal,
              update: retireGoal
            }
          } : undefined,
          policies: policies ? {
            upsert: {
              create: policies,
              update: policies
            }
          } : undefined
        },
        include: {
          incomePlan: true,
          spendingPlan: true,
          debts: true,
          cashPlan: true,
          homeGoal: true,
          retireGoal: true,
          policies: true
        }
      });

      // Handle debts separately
      if (debts && Array.isArray(debts)) {
        // Delete old debts
        await prisma.debt.deleteMany({
          where: { householdId: household.id }
        });

        // Create new debts
        for (const debt of debts) {
          await prisma.debt.create({
            data: {
              ...debt,
              householdId: household.id
            }
          });
        }
      }
    } else {
      // Create new household
      household = await prisma.household.create({
        data: {
          userId: req.user.userId,
          filingStatus,
          location,
          riskNote,
          sleepScore,
          members,
          incomePlan: incomePlan ? { create: incomePlan } : undefined,
          spendingPlan: spendingPlan ? { create: spendingPlan } : undefined,
          debts: debts ? { create: debts } : undefined,
          cashPlan: cashPlan ? { create: cashPlan } : undefined,
          homeGoal: homeGoal ? { create: homeGoal } : undefined,
          retireGoal: retireGoal ? { create: retireGoal } : undefined,
          policies: policies ? { create: policies } : undefined
        },
        include: {
          incomePlan: true,
          spendingPlan: true,
          debts: true,
          cashPlan: true,
          homeGoal: true,
          retireGoal: true,
          policies: true
        }
      });
    }

    res.status(existingHousehold ? 200 : 201).json({
      message: existingHousehold ? 'Household updated successfully' : 'Household created successfully',
      household
    });
  } catch (error) {
    console.error('Create/Update household error:', error);
    res.status(500).json({ error: 'An error occurred while saving household data' });
  }
});

/**
 * DELETE /api/household
 * Delete household and all related data for the authenticated user
 */
router.delete('/', async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const household = await prisma.household.findUnique({
      where: { userId: req.user.userId }
    });

    if (!household) {
      res.status(404).json({ error: 'Household not found' });
      return;
    }

    await prisma.household.delete({
      where: { userId: req.user.userId }
    });

    res.json({ message: 'Household deleted successfully' });
  } catch (error) {
    console.error('Delete household error:', error);
    res.status(500).json({ error: 'An error occurred while deleting household data' });
  }
});

export default router;
