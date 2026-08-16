import express from 'express';
// --- ADD deleteMachine HERE ---
import { 
  createMachine, 
  getMachines, 
  getMachineById, 
  deleteMachine 
} from '../controllers/machine.controller.js'; 
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.route('/')
  .get(getMachines)
  .post(protect, authorizeRoles('owner', 'admin'), createMachine);

router.route('/:id')
  .get(getMachineById)
  // --- ADD THIS LINE ---
  .delete(protect, authorizeRoles('owner', 'admin'), deleteMachine); 

export default router;
