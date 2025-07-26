const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailService = require('../services/emailService')

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, location, phone } = req.body
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name, email, password: hash, role, location, phone
    })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET)
    res.json({ user, token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.validate = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    
    // Store reset token in user document (you might want to add a resetToken field to User model)
    // For now, we'll just send the token via email
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    
    // Send email (placeholder implementation)
    await emailService.sendEmail(
      user.email,
      'Password Reset Request',
      `Click this link to reset your password: ${resetUrl}`
    )
    
    res.json({ message: 'Password reset email sent' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    
    // Hash new password
    const hash = await bcrypt.hash(newPassword, 10)
    user.password = hash
    await user.save()
    
    res.json({ message: 'Password reset successful' })
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }
    res.status(500).json({ message: err.message })
  }
}
