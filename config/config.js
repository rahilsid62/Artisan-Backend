// Centralized configuration (can be expanded as needed)
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  uploadDir: process.env.UPLOAD_DIR || 'uploads/products',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
