import { Router } from "express";
import { getWeeklyLeaderboard } from "../../handler/gamificationHandler/gamificationHandler";

/**
 * @swagger
 * tags:
 *   name: Gamification
 *   description: Leaderboard and gamification related endpoints
 */
const router = Router();

/**
 * @swagger
 * /api/v1/gamification:
 *   get:
 *     summary: Get weekly leaderboard
 *     tags: [Gamification]
 *     responses:
 *       200:
 *         description: Weekly leaderboard retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get("/", getWeeklyLeaderboard);

export default router;
