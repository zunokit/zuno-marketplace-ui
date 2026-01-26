/**
 * Các helper format dùng chung cho NFT, giá (ETH/crypto), token ID.
 * Dùng ở marketplace, profile, auctions, nft-detail, v.v.
 */

export function formatTokenId(tokenId: string): string {
  if (!tokenId) return "—";
  if (/^\d+$/.test(tokenId)) return `#${tokenId}`;
  if (tokenId.length > 14) return `${tokenId.slice(0, 6)}...${tokenId.slice(-4)}`;
  return tokenId;
}

/** Rút gọn số để ít bị truncate (3–4 chữ số thập phân; giữ full trong title). */
export function formatPriceShort(value: string): string {
  if (!value || value === "—") return value;
  const n = parseFloat(value);
  if (Number.isNaN(n)) return value.length > 10 ? `${value.slice(0, 8)}…` : value;
  if (n >= 1000) return n.toFixed(0);
  if (n >= 1) return n.toFixed(2);
  if (n >= 0.01) return n.toFixed(3);
  if (n > 0) return n.toPrecision(2);
  return value;
}

/** Ký hiệu ETH gọn (Ξ) thay " ETH" để ít bị cắt trong ô hẹp. */
export const ETH_SYMBOL = " Ξ";
