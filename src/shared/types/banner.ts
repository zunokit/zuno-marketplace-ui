export type Banner = {
  name: string;
  author: string;
  totalItems: number;
  /** Optional. Shown in Floor Price stat; use "—" when absent. */
  floorPrice?: string;
  thumbnailImages: string[];
  mainBackground: string;
};
