const User = require('../models/User')

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password')
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const avatarUrl = req.file.path
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { avatar: avatarUrl }, 
      { new: true }
    ).select('-password')

    res.json({ user, avatar: avatarUrl })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getArtisans = async (req, res) => {
  try {
    const artisans = await User.find({ role: 'artisan' }).select('-password')
    res.json(artisans)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.getArtisanById = async (req, res) => {
  try {
    console.log('Requested artisan ID:', req.params.id);
    let artisan = await User.findOne({ _id: req.params.id, role: 'artisan' }).select('-password');
    console.log('Artisan found with role check:', artisan);
    if (!artisan) {
      // Try finding by ID only for debugging
      artisan = await User.findById(req.params.id).select('-password');
      console.log('Artisan found by ID only:', artisan);
      if (!artisan) {
        return res.status(404).json({ message: 'Artisan not found' });
      } else {
        return res.status(404).json({ message: 'User found, but not an artisan', user: artisan });
      }
    }
    res.json(artisan);
  } catch (err) {
    console.error('Error in getArtisanById:', err);
    res.status(500).json({ message: err.message });
  }
}

// Wishlist controllers
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      populate: { path: 'artisan', select: 'name email avatar' }
    }).select('wishlist')
    res.json(user.wishlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body
    if (!productId) return res.status(400).json({ message: 'Product ID required' })
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { wishlist: productId } },
      { new: true }
    ).populate({
      path: 'wishlist',
      populate: { path: 'artisan', select: 'name email avatar' }
    }).select('wishlist')
    res.json(user.wishlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate({
      path: 'wishlist',
      populate: { path: 'artisan', select: 'name email avatar' }
    }).select('wishlist')
    res.json(user.wishlist)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
