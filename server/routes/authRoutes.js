import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/auth.js';
import { registerValidation, loginValidation, validateRequest } from '../middlewares/validator.js';

const router = express.Router();

router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
