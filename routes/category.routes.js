import express from 'express';
import { getCategories, createCategory } from '../controllers/category.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorizeRoles('admin'), createCategory);

export default router;

