import { Router } from 'express';
import { createBoard } from '../controllers/board.controller';

const router = Router({ mergeParams: true });

router.post('/', createBoard);

export default router;