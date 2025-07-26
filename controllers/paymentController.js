const Order = require('../models/Order')

// This is a placeholder; in a real app, integrate Stripe/Razorpay/etc.
exports.checkout = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body
    
    // Calculate total amount
    const totalAmount = items.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      items: items.map(item => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
        artisan: item.artisan
      })),
      shippingAddress: shippingAddress || {},
      totalAmount,
      status: 'confirmed', // Since payment is successful
      orderDate: new Date()
    })

    // Populate order with product details
    const populatedOrder = await Order.findById(order._id).populate('items.product')

    res.json({ 
      message: 'Payment processed successfully', 
      order: populatedOrder 
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
  