import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ message: 'api is running'});
});

app.listen(port, () => {
    console.log('server is running at http://localhost:${port}');;
});