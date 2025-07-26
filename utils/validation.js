// Example validation helpers for user and product input

exports.isEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  exports.isStrongPassword = (password) => {
    // At least 6 chars; you can make this stricter
    return typeof password === 'string' && password.length >= 6;
  };
  
  exports.validateProductInput = (product) => {
    if (!product.name || !product.price) return false;
    if (typeof product.price !== 'number' || product.price < 0) return false;
    return true;
  };
  