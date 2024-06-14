import * as express from 'express';
import { home, addUser, getUser, getUsersList, updateUser, createJwtToken, validateToken } from '../controller/api';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', home);
router.get('/create-token', createJwtToken);
router.post('/validate-token', validateToken);
router.post("/add-user", authMiddleware, addUser);
router.get("/fetch-user-data", authMiddleware, getUsersList);
router.get("/user-data", authMiddleware, getUser);
router.put("/update-user-data", authMiddleware, updateUser);

export default router;