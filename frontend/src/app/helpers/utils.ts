export const formatWalletAddress = (address: string) => {
  const formatted = address.slice(2, 5) + '...' + address.slice(-4);
  return '0x' + formatted.toUpperCase();
};
