const Product = require('../models/Product')
const User = require('../models/User')

exports.getAll = async (req, res) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    if (req.query.artisan) filter.artisan = req.query.artisan
    if (req.query.featured) filter.featured = true
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } }
      ]
    }
    if (req.query.inStock) filter.inventory = { $gt: 0 }
    if (req.query.customizable) filter.customizable = true
    if (req.query.priceRange) {
      const [min, max] = req.query.priceRange.split('-').map(Number)
      if (max) {
        filter.price = { $gte: min, $lte: max }
      } else {
        filter.price = { $gte: min }
      }
    }

    let query = Product.find(filter).populate('artisan', 'name avatar location')
    
    // Sorting
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'price-low':
          query = query.sort({ price: 1 })
          break
        case 'price-high':
          query = query.sort({ price: -1 })
          break
        case 'oldest':
          query = query.sort({ createdAt: 1 })
          break
        case 'popular':
          query = query.sort({ 'reviews.length': -1 })
          break
        default:
          query = query.sort({ createdAt: -1 }) // newest
      }
    } else {
      query = query.sort({ createdAt: -1 })
    }

    // Limit results
    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit))
    }

    const products = await query
    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artisan', 'name avatar location')
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.create = async (req, res) => {
  try {
    const { name, description, price, category, inventory, featured } = req.body
    const images = req.files ? req.files.map(f => f.path) : []
    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      artisan: req.user.id,
      inventory,
      featured: !!featured
    })
    res.status(201).json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.update = async (req, res) => {
  try {
    // Support both JSON and multipart/form-data
    let updates = req.body
    let product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    // Handle images
    let existingImages = []
    if (Array.isArray(req.body.existingImages)) {
      existingImages = req.body.existingImages
    } else if (typeof req.body.existingImages === 'string') {
      existingImages = [req.body.existingImages]
    } else {
      existingImages = product.images || []
    }
    // Add new uploaded images
    const newImages = req.files ? req.files.map(f => f.path) : []
    const images = [...existingImages, ...newImages]

    // Update fields
    product.name = updates.name || product.name
    product.description = updates.description || product.description
    product.price = updates.price || product.price
    product.category = updates.category || product.category
    product.images = images
    product.inventory = updates.inventory || product.inventory
    product.featured = updates.featured !== undefined ? updates.featured : product.featured

    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.delete = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.search = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } }
      ]
    }).populate('artisan', 'name avatar location')

    res.json(products)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
