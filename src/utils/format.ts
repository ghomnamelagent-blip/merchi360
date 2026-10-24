/**
 * Formats a number into Pakistani Rupees (PKR / Rs.) currency display.
 * Example: 1899 -> "Rs. 1,899"
 */
export const formatPKR = (amount: number): string => {
  const rounded = Math.round(amount);
  return `Rs. ${rounded.toLocaleString('en-PK')}`;
};
