import express from 'express';
import {body} from "express-validator"
import { getUserProfile, logoutUser, registerUser } from '../controllers/userController';
import { authUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters long')
],
registerUser)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min: 4}).withMessage('Password must be at least 4 characters long')
],
loginUser)

router.get('/profile', authUser, getUserProfile)

router.get('/logout', authUser, logoutUser)

export default router;