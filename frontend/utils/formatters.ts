/**
 * Formats a price value as USD currency
 * @param price - The price value to format
 * @returns Formatted price string (e.g., $12.34)
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};

/**
 * Rounds a price to 2 decimal places
 * @param price - The price value to round
 * @returns Rounded price value
 */
export const roundPrice = (price: number): number => {
  return Math.round(price * 100) / 100;
}; 