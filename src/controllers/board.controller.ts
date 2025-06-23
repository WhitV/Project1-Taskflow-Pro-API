import { Request, Response, RequestHandler } from 'express';
import pool from '../config/database';

export const createBoard:
RequestHandler = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const { projectID } = req.params;
        const userId = req.userId;

        if (!name) {
            res.status(400).json({
                message: 'Board name is required'
            })
            return;
        }

        if (!userId) {
            res.status(401).json({
                message: 'Authentication error'
            })
            return;
        }
        const memberCheck = await pool.query('SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2', [projectID, userId]
        );

        if (memberCheck.rows,length === 0){ res.status(403).json({ massage:'Forbidden: You are not a member of this project' });
        return;
        }
        const newBoard = await pool.query(
            'INSERT INTO boards (name, project_id) VALUES ($1, $2) RETURNING *',
            [name, projectID]
        );
        res.status(201).json(newBoard.rows[0]);
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};