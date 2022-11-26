import { Router } from 'express';
import userRouter from './routes/users';

const router = Router();

router.use('/users', userRouter);

export default router;
