import { Router } from 'express';
import { authenticate, requireToolsAccess } from '../../middleware/auth';
import { getPositiveEV, getSports } from '../../controllers/sportsToolsController';

const router = Router();

// All sports tools routes require authentication and tools access
router.use(authenticate);
router.use(requireToolsAccess);

// Routes
router.get('/sports', getSports);
router.get('/positive-ev', getPositiveEV);

// TODO: Implement other routes
// router.get('/cheat-sheet', getCheatSheet);
// router.get('/injuries-news', getInjuriesNews);
// router.get('/arbitrage', getArbitrage);
// router.get('/middle-betting', getMiddleBetting);
// router.get('/dfs-positive-ev', getDFSPositiveEV);
// router.post('/parlay-generator', generateParlay);

export default router;

