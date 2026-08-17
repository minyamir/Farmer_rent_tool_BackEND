import Booking from '../models/Booking.js';
import Machine from '../models/Machine.js';

export const createBooking = async (req, res) => {
  try {
    const { machineId, startDate, endDate } = req.body;

    // Check if machine exists
    const machine = await Machine.findById(machineId);
    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    // Check availability
    const available = await Booking.isAvailable(machineId, new Date(startDate), new Date(endDate));
    if (!available) return res.status(400).json({ message: 'Machine already booked for these dates' });

    const totalPrice = ((new Date(endDate) - new Date(startDate)) / (1000*60*60*24) + 1) * machine.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      machine: machineId,
      startDate,
      endDate,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getOwnerBookings = async (req, res) => {
  try {
    const machines = await Machine.find({ owner: req.user._id });
    const bookings = await Booking.find({ machine: { $in: machines.map(m => m._id) } })
                                  .populate('user', 'name email')
                                  .populate('machine', 'name');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('machine', 'name pricePerDay image'); // Must include 'image'
    
    // Add virtual field for 'days' if your Schema doesn't calculate it
    const formattedBookings = bookings.map(b => {
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      return { ...b._doc, days };
    });

    res.json(formattedBookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('machine');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // AUTH CHECK: Allow if user is the machine OWNER OR the RENTER cancelling it
    const isOwner = booking.machine.owner.toString() === req.user._id.toString();
    const isRenter = booking.user.toString() === req.user._id.toString();

    if (isOwner || (isRenter && status === 'cancelled')) {
      booking.status = status;
      await booking.save();
      return res.json(booking);
    }

    // This is where your 403 was coming from!
    res.status(403).json({ message: 'You do not have permission to update this booking' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

