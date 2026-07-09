
const userSchema = mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Please add a name'],
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Please add an email'], 
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: { 
      type: String, 
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // 🔒 Keeps password hidden from API responses by default....
    },
    role: {
      type: String,
      enum: ['renter', 'owner', 'admin'],
      default: 'renter',
    },
    avatar: {
      type: String,
      default: ''
    }
  },
  { 
    timestamps: true 
  }
);

/**
 * 🔒 MIDDLEWARE: Password Hashing
 * Fixed: Removed 'next' parameter to prevent "next is not a function" error.
 */
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * 🔑 METHOD: Generate JWT
 * Signs a token using the user's ID and your secret key.
 */
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * 🔑 METHOD: Password Comparison
 * Used during login to check if the entered password matches the hash.
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare against the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
