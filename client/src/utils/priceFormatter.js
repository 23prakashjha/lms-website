export const formatPrice = (price) => {
  if (price === 0 || price === '0') {
    return 'Free'
  }
  return `₹${Number(price).toLocaleString('en-IN')}`
}

export const formatPriceWithOriginal = (price, discountPrice) => {
  if (discountPrice) {
    return {
      original: `₹${Number(price).toLocaleString('en-IN')}`,
      discounted: `₹${Number(discountPrice).toLocaleString('en-IN')}`,
      discount: Math.round((1 - discountPrice / price) * 100)
    }
  }
  return {
    original: null,
    discounted: `₹${Number(price).toLocaleString('en-IN')}`,
    discount: null
  }
}
