import mongoose from 'mongoose';

const bookingSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    machine: { type: mongoose.Schema.Types.ObjectId, ref: 'Machine', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled'], 
        default: 'pending' 
    }
}, { timestamps: true });

// --- YOU MUST ADD THIS STATIC METHOD ---
bookingSchema.statics.isAvailable = async function (machineId, start, end) {
    const conflict = await this.findOne({
        machine: machineId,
        status: { $ne: 'cancelled' },
        $or: [
            { startDate: { $lte: end }, endDate: { $gte: start } }
        ]
    });
    return !conflict; // Returns true if no conflict found
};

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;