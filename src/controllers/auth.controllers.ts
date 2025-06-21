import { Request, Response, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/database';
import jwt from 'jsonwebtoken';

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
};

export const login: RequestHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            res.status(401).json({ message: 'invalid credentials' });
            return;
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
        });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};