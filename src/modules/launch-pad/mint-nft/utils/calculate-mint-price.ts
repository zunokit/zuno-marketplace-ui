import { parseEther } from "viem";

export interface MintPriceCalculation {
  unitPrice: string;
  totalPrice: string;
  totalValue: string; // in wei for transaction
  currencySymbol: string;
}

/**
 * Calculate total mint price including fees
 * @param unitPrice - Price per NFT in ETH
 * @param quantity - Number of NFTs to mint
 * @param mintFee - Mint fee per NFT in ETH (default: 0.009)
 * @param protocolFee - Protocol fee per NFT in ETH (default: 0.0042)
 * @param currencySymbol - Currency symbol (default: ETH)
 * @returns Calculated prices
 */
export function calculateMintPrice(
  unitPrice: string,
  quantity: number,
  mintFee: string = "0.009",
  protocolFee: string = "0.0042",
  currencySymbol: string = "ETH"
): MintPriceCalculation {
  const unitPriceNum = parseFloat(unitPrice || "0");
  const mintFeeNum = parseFloat(mintFee);
  const protocolFeeNum = parseFloat(protocolFee);

  // Calculate total price (unit price * quantity)
  const totalUnitPrice = unitPriceNum * quantity;

  // Calculate total fees
  const totalMintFee = mintFeeNum * quantity;
  const totalProtocolFee = protocolFeeNum * quantity;

  // Total price including fees
  const totalPrice = totalUnitPrice + totalMintFee + totalProtocolFee;

  // Convert to wei for transaction value using viem
  const totalValue = parseEther(totalPrice.toString()).toString();

  return {
    unitPrice: unitPriceNum.toFixed(4),
    totalPrice: totalPrice.toFixed(4),
    totalValue,
    currencySymbol,
  };
}

/**
 * Get currency symbol from chain ID
 * @param chainId - Chain ID string
 * @returns Currency symbol
 */
export function getCurrencySymbolFromChainId(chainId?: string): string {
  if (!chainId) return "ETH";
  if (chainId.includes("solana") || chainId.includes("sol")) return "SOL";
  if (chainId.includes("polygon")) return "MATIC";
  return "ETH";
}
