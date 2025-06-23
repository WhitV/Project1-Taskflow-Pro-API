import { Router } from 'express';
import { createBoard } from '../controllers/board.controller';

const router = Router();

router.post('/', createBoard);

export default router;