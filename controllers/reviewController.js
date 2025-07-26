const Product = require('../models/Product')

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body
    const review = {
      user: req.user.id,
      rating,
      comment,
      date: new Date()
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: review } },
      { new: true }
    )
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product.reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
