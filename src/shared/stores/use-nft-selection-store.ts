import { create } from 'zustand';

/**
 * Action mode for NFT operations
 */
export type ActionMode = 'buy' | 'sell';

/**
 * NFT Selection Store Interface
 * Manages global state for NFT selection across the marketplace
 */
interface NFTSelectionStore {
  // State
  /** Selected NFT IDs */
  selectedNFTs: string[];
  /** Available NFT IDs for slider selection */
  availableNFTs: string[];
  /** Maximum number of items that can be selected */
  maxItems: number;
  /** Slider value for bulk selection */
  sliderValue: number;
  /** Current action mode (buy/sell) */
  actionMode: ActionMode;
  /** Cart popover/drawer open state */
  cartOpen: boolean;

  // Actions
  /** Set cart (popover/drawer) open state */
  setCartOpen: (open: boolean) => void;
  /** Add an NFT ID to selection */
  add: (id: string) => void;
  /** Remove an NFT ID from selection */
  remove: (id: string) => void;
  /** Toggle an NFT ID (add if not present, remove if present) */
  toggle: (id: string) => void;
  /** Set selected NFTs to a specific array */
  set: (ids: string[]) => void;
  /** Clear all selections */
  clear: () => void;
  /** Update slider value and select NFTs up to that value */
  setSliderValue: (value: number) => void;
  /** Update action mode */
  setActionMode: (mode: ActionMode) => void;
  /** Update max items limit */
  setMaxItems: (max: number) => void;
  /** Update available NFTs for slider */
  setAvailableNFTs: (nftIds: string[]) => void;
}

/**
 * Zustand store for NFT selection state management
 * Provides global state and actions for NFT selection across components
 *
 * @example
 * ```tsx
 * // In component
 * const { selectedNFTs, add, remove } = useNFTSelectionStore();
 *
 * // Toggle selection
 * const handleToggle = (id: string) => {
 *   if (selectedNFTs.includes(id)) {
 *     remove(id);
 *   } else {
 *     add(id);
 *   }
 * };
 * ```
 */
export const useNFTSelectionStore = create<NFTSelectionStore>((set) => ({
  // Initial state
  selectedNFTs: [],
  availableNFTs: [],
  maxItems: 0,
  sliderValue: 0,
  actionMode: 'buy',
  cartOpen: false,

  // Actions
  setCartOpen: (open) => set({ cartOpen: open }),
  add: (id) =>
    set((state) => {
      // Prevent duplicates and enforce max items
      if (state.selectedNFTs.includes(id) || state.selectedNFTs.length >= state.maxItems) {
        return state;
      }
      return {
        selectedNFTs: [...state.selectedNFTs, id],
        sliderValue: state.selectedNFTs.length + 1,
      };
    }),

  remove: (id) =>
    set((state) => ({
      selectedNFTs: state.selectedNFTs.filter((nftId) => nftId !== id),
      sliderValue: Math.max(0, state.selectedNFTs.length - 1),
    })),

  toggle: (id) =>
    set((state) => {
      const isSelected = state.selectedNFTs.includes(id);
      let newSelectedNFTs: string[];

      if (isSelected) {
        newSelectedNFTs = state.selectedNFTs.filter((nftId) => nftId !== id);
      } else {
        // Enforce max items limit
        if (state.selectedNFTs.length >= state.maxItems) {
          return state;
        }
        newSelectedNFTs = [...state.selectedNFTs, id];
      }

      return {
        selectedNFTs: newSelectedNFTs,
        sliderValue: newSelectedNFTs.length,
      };
    }),

  set: (ids) =>
    set({
      selectedNFTs: ids,
      sliderValue: ids.length,
    }),

  clear: () =>
    set({
      selectedNFTs: [],
      sliderValue: 0,
    }),

  setSliderValue: (value) =>
    set((state) => {
      // Select NFTs from the beginning of available list up to slider value
      const newSelectedNFTs = state.availableNFTs.slice(0, value);
      return {
        sliderValue: value,
        selectedNFTs: newSelectedNFTs,
      };
    }),

  setActionMode: (mode) =>
    set({ actionMode: mode }),

  setMaxItems: (max) =>
    set({ maxItems: max }),

  setAvailableNFTs: (nftIds) =>
    set({ availableNFTs: nftIds }),
}));
