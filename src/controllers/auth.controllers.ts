import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

export const register:RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message : 'Email and password are required' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email', [email, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}