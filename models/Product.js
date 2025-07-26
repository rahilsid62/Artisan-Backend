const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  date: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    images: [String],
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    inventory: { type: Number, default: 1 },
    materials: [String],
    dimensions: String,
    customizable: { type: Boolean, default: false },
    tags: [String],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['active', 'inactive', 'sold'], default: 'active' },
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
