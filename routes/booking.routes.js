import express from 'express';
import { createBooking, getMyBookings, getOwnerBookings, updateBookingStatus } from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';


const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/owner', protect, authorizeRoles('owner'), getOwnerBookings);
// Change this line:ok
router.patch('/:id/status', protect, updateBookingStatus); // Removed authorizeRoles('owner')

export default router;
