import { Router } from 'express';
import { validateBody } from '../middleware/validation.middleware';
import { accountPayloadSchema } from '../schemas';
import {
  createAccountHandler,
  updateAccountHandler,
  getStatsHandler,
} from '../controllers/account.controller';

const router = Router();

router.post('/', validateBody(accountPayloadSchema), createAccountHandler);
router.put('/:id', validateBody(accountPayloadSchema), updateAccountHandler);
router.get('/stats', getStatsHandler);

export default router;
