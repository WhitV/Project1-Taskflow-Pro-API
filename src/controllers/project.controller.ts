import { Response, RequestHandler } from "express";
import pool from '../config/database';

export const createProject: RequestHandler = async (req: any, res: Response) => {
    try {
        const { name } = req.body;
        const ownerId = req.userId;
        if (!name) {
            res.status(400).json({ message: 'Project name is required' });
            return;
        }

        const newProject = await pool.query(
            'INSERT INTO projects (name, owner_id) VALUES ($1, $2) RETURNING *',
            [name, ownerId] 
        );

        const projectId = newProject.rows[0].id;
        await pool.query(
            'INSERT INTO project_members (project_id, user_id,) VALUES ($1, $2)',
            [projectId, ownerId] 
        );

        res.status(201).json(newProject.rows[0]);
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProjects: RequestHandler = async (req: any, res: Response) => {
    try {
        const userId = req.userId;
        const projects = await pool.query(
            'SELECT projects.* FROM projects JOIN project_members ON projects.id = project_members.project_id WHERE project_members.user_id = $1' ,[userId]
        );

        res.status(200).json(projects.rows);
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const addMemberToProject: RequestHandler = async (req: any, res: Response) => {
  try {
    const { email } = req.body;
    const { id: projectId } = req.params; 
    const inviterId = req.userId;

    const projectResult = await pool.query('SELECT owner_id FROM projects WHERE id = $1', [projectId]);
    if (projectResult.rows.length === 0) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }
    if (projectResult.rows[0].owner_id.toString() !== inviterId) {
      res.status(403).json({ message: 'Forbidden: Only the project owner can add members' });
      return;
    }

    const userToInviteResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userToInviteResult.rows.length === 0) {
      res.status(404).json({ message: `User with email ${email} not found` });
      return;
    }
    const inviteeId = userToInviteResult.rows[0].id;

    await pool.query(
      'INSERT INTO project_members (project_id, user_id) VALUES ($1, $2)',
      [projectId, inviteeId]
    );

    res.status(201).json({ message: 'Member added successfully' });

  } catch (error: any) {

    if (error.code === '23505') { 
      res.status(409).json({ message: 'User is already a member of this project' });
      return;
    }
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};