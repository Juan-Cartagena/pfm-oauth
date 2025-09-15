import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const profileController = new ProfileController();

// All profile routes require authentication
router.use(authenticateToken);

router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

export default router;