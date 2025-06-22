import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { createProject, getProjects, addMemberToProject } from '../controllers/project.controller'; 

const router = Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.post('/:id/members', authMiddleware, addMemberToProject);


export default router;