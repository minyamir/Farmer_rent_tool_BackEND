import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a category name'], 
    unique: true,
    trim: true,
    maxlength: [32, 'Name cannot be more than 32 characters']
  },
  slug: {
    type: String,
    lowercase: true
  },
  icon: {
    type: String,
    default: 'Tractor' // Stores the name of the Lucide icon to use in the UI
  }
}, { 
  timestamps: true,
  // This ensures that when we convert to JSON, virtuals are included
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware to create a slug from the name before saving (e.g., "Heavy Machinery" -> "heavy-machinery")
categorySchema.pre('save', function(next) {
  this.slug = this.name.split(' ').join('-').toLowerCase();
  next();
});

const Category = mongoose.model('Category', categorySchema);
export default Category;