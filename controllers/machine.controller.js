import Machine from '../models/Machine.js';

// backend/controllers/machine.controller.js
export const createMachine = async (req, res) => {
  try {
    // 1. Destructure ALL the required fields from the request body
    const { name, category, pricePerDay, description, image, location } = req.body;

    // 2. Pass them into the Create method
    const machine = await Machine.create({
      name,
      category,
      pricePerDay,
      description, // Added this
      image,       // Added this
      location,    // Added this
      owner: req.user._id,
    });

    res.status(201).json(machine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);

    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    // Optional: Check if the user trying to delete is the owner
    // if (machine.owner.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

    await machine.deleteOne();
    res.json({ message: "Machine removed from fleet" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get all machines
export const getMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate('category', 'name').populate('owner', 'name email');
    res.json(machines);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get machine by ID
export const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id)
      .populate('category', 'name')
      .populate('owner', 'name email');

    if (!machine) return res.status(404).json({ message: 'Machine not found' });

    res.json(machine);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

