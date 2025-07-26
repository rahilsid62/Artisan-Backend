const Order = require('../models/Order')

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body
    const order = await Order.create({
      customer: req.user.id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      orderDate: new Date()
    })
    res.status(201).json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'artisan'
      ? { 'items.artisan': req.user.id }
      : { customer: req.user.id }
    const orders = await Order.find(filter)
      .populate('items.product')
      .populate('items.artisan', 'name email')
      .sort({ orderDate: -1 }) // Most recent first
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
