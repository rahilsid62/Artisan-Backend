require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

// 1. Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/artisan_marketplace';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // 2. Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  await Order.deleteMany({});

  // 3. Create users (artisan and customer)
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [artisan, customer] = await User.insertMany([
    {
      name: 'Alice Artisan',
      email: 'alice@artisan.com',
      password: hashedPassword,
      role: 'artisan',
      location: 'Jaipur',
      phone: '9876543210',
      bio: 'Pottery specialist with 10 years experience.',
      skills: ['pottery', 'ceramics'],
      avatar: '/avatar-placeholder.png'
    },
    {
      name: 'Bob Buyer',
      email: 'bob@buyer.com',
      password: hashedPassword,
      role: 'customer',
      location: 'Delhi',
      phone: '9123456780'
    }
  ]);

  // 4. Create products (linked to artisan)
  const [product1, product2] = await Product.insertMany([
    {
      name: 'Handmade Clay Vase',
      description: 'A beautiful, hand-crafted clay vase.',
      price: 1200,
      category: 'pottery',
      images: ['/images/pottery.jpg'],
      artisan: artisan._id,
      inventory: 5,
      featured: true
    },
    {
      name: 'Traditional Textile Scarf',
      description: 'Colorful scarf made using traditional weaving.',
      price: 800,
      category: 'textiles',
      images: ['/images/textiles.jpg'],
      artisan: artisan._id,
      inventory: 10,
      featured: true
    }
  ]);

  // 5. Create a sample order (customer buys product1)
  await Order.create({
    customer: customer._id,
    items: [
      {
        product: product1._id,
        quantity: 1,
        price: product1.price,
        artisan: artisan._id
      }
    ],
    totalAmount: product1.price,
    status: 'pending',
    shippingAddress: {
      street: '123 Main St',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    orderDate: new Date()
  });

  console.log('Database seeded!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
