import mongoose from 'mongoose';

const machineSchema = mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a machine name'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'Please add a detailed description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  pricePerDay: { 
    type: Number, 
    required: [true, 'Please set a daily rental price'] 
  },
  image: { 
    type: String, 
    required: [true, 'Please upload at least one image URL or Base64 string'] 
  },
  location: { 
    type: String, 
    required: [true, 'Machine location is required for logistics'] 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  // High-end feature: Tracking popularity
  views: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});



const Machine = mongoose.model('Machine', machineSchema);
export default Machine;
