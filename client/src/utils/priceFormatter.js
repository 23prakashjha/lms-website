export const formatPrice = (price) => {
  if (price === 0 || price === '0') {
    return 'Free'
  }
  const inr = Math.round(price * 83)
  return `₹${inr.toLocaleString('en-IN')}`
}

export const formatPriceWithOriginal = (price, discountPrice) => {
  if (discountPrice) {
    const originalInr = Math.round(price * 83)
    const discountedInr = Math.round(discountPrice * 83)
    return {
      original: `₹${originalInr.toLocaleString('en-IN')}`,
      discounted: `₹${discountedInr.toLocaleString('en-IN')}`,
      discount: Math.round((1 - discountPrice / price) * 100)
    }
  }
  const inr = Math.round(price * 83)
  return {
    original: null,
    discounted: `₹${inr.toLocaleString('en-IN')}`,
    discount: null
  }
}
