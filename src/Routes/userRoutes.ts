import express from 'express';
import { registerUser} from '../Controllers/userController';


const router = express.Router();

// Public Routes
router.post('/register', registerUser);



export default router;
