import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log('--- [AUTH MIDDLEWARE] ยามเริ่มทำงาน ---');
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
    console.error('--- [AUTH MIDDLEWARE] ล้มเหลว: ไม่พบบัตรผ่าน (No authHeader) ---');
        res.status(401).json({ message: 'No token provided' });
        return;
    }

    const token = authHeader.split(' ')[1];
    console.log('--- [AUTH MIDDLEWARE] ได้รับบัตรผ่านแล้ว:', token);
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        if (err) {
    console.error('--- [AUTH MIDDLEWARE] ล้มเหลว: บัตรผ่านปลอมหรือหมดอายุ', err);
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
         console.log('--- [AUTH MIDDLEWARE] ตรวจสอบบัตรสำเร็จ! ข้อมูลที่อ่านได้:', decoded);
            req.userId = (decoded as any).userId;
    console.log('--- [AUTH MIDDLEWARE] รหัสพนักงานที่จะแนบไปกับคำขอ:', req.userId);
    console.log('--- [AUTH MIDDLEWARE] เปิดประตูให้ผ่าน! ---');
        next();
    });
};