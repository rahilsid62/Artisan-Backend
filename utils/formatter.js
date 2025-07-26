// Formatting helpers

exports.formatPrice = (price) => {
    return Number(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };
  
  exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US');
  };
  