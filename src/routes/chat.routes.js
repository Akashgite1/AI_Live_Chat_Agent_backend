import { Router } from 'express';
import { sendMessage , getHistory} from '../controllers/chat.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateMessage } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/message', validateMessage, asyncHandler(sendMessage));
router.get("/history/:sessionId", asyncHandler(getHistory));

export default router;
