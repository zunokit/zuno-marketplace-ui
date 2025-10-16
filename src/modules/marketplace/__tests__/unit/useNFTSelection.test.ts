import { renderHook, act } from "@testing-library/react";
import { useNFTSelection } from "@/modules/marketplace/hooks/useNFTSelection";
import { mockNFTs } from "../fixtures/mockNFTs";

describe("useNFTSelection Hook", () => {
  const mockCallbacks = {
    onVisibleNFTsChange: jest.fn(),
    onSelectedNFTsChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with empty selection", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.sliderValue).toBe(0);
      expect(result.current.isSliding).toBe(false);
    });
  });

  describe("Slider Selection", () => {
    it("should select NFTs when slider value changes", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleSliderChange(3);
      });

      expect(result.current.selectedIds.size).toBe(3);
      expect(result.current.sliderValue).toBe(3);
      expect(mockCallbacks.onSelectedNFTsChange).toHaveBeenCalled();
    });

    it("should not exceed available NFTs count", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleSliderChange(100); // More than available
      });

      expect(result.current.selectedIds.size).toBe(mockNFTs.length);
    });

    it("should handle slider drag events", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleSliderDragStart();
      });

      expect(result.current.isSliding).toBe(true);

      act(() => {
        result.current.handleSliderDragEnd();
      });

      expect(result.current.isSliding).toBe(false);
    });
  });

  describe("Individual Selection", () => {
    it("should select individual NFT", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleIndividualSelection(mockNFTs[0].id, true);
      });

      expect(result.current.selectedIds.has(mockNFTs[0].id)).toBe(true);
      expect(result.current.selectedIds.size).toBe(1);
      expect(result.current.sliderValue).toBe(1);
    });

    it("should deselect individual NFT", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      // Select first
      act(() => {
        result.current.handleIndividualSelection(mockNFTs[0].id, true);
      });

      expect(result.current.selectedIds.size).toBe(1);

      // Deselect
      act(() => {
        result.current.handleIndividualSelection(mockNFTs[0].id, false);
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.sliderValue).toBe(0);
    });

    it("should handle multiple individual selections", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      // Select each NFT separately with individual act() calls
      act(() => {
        result.current.handleIndividualSelection(mockNFTs[0].id, true);
      });

      act(() => {
        result.current.handleIndividualSelection(mockNFTs[2].id, true);
      });

      act(() => {
        result.current.handleIndividualSelection(mockNFTs[4].id, true);
      });

      expect(result.current.selectedIds.size).toBe(3);
      expect(result.current.selectedIds.has(mockNFTs[0].id)).toBe(true);
      expect(result.current.selectedIds.has(mockNFTs[2].id)).toBe(true);
      expect(result.current.selectedIds.has(mockNFTs[4].id)).toBe(true);
    });
  });

  describe("Clear Selections", () => {
    it("should clear all selections", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      // Select some NFTs
      act(() => {
        result.current.handleSliderChange(3);
      });

      expect(result.current.selectedIds.size).toBe(3);

      // Clear all
      act(() => {
        result.current.clearSelections();
      });

      expect(result.current.selectedIds.size).toBe(0);
      expect(result.current.sliderValue).toBe(0);
      expect(mockCallbacks.onSelectedNFTsChange).toHaveBeenLastCalledWith(new Set());
    });
  });

  describe("Item Count Change", () => {
    it("should handle item count input", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleItemCountChange("3");
      });

      expect(result.current.sliderValue).toBe(3);
      expect(result.current.selectedIds.size).toBe(3);
    });

    it("should handle invalid input gracefully", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleItemCountChange("invalid");
      });

      expect(result.current.sliderValue).toBe(0);
      expect(result.current.selectedIds.size).toBe(0);
    });

    it("should cap item count to available NFTs", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleItemCountChange("999");
      });

      expect(result.current.sliderValue).toBe(mockNFTs.length);
      expect(result.current.selectedIds.size).toBe(mockNFTs.length);
    });
  });

  describe("Callback Triggers", () => {
    it("should call onVisibleNFTsChange when selection changes", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleSliderChange(2);
      });

      expect(mockCallbacks.onVisibleNFTsChange).toHaveBeenCalled();
    });

    it("should call onSelectedNFTsChange with correct Set", () => {
      const { result } = renderHook(() =>
        useNFTSelection({
          initialNFTs: mockNFTs,
          ...mockCallbacks,
        })
      );

      act(() => {
        result.current.handleIndividualSelection(mockNFTs[0].id, true);
      });

      expect(mockCallbacks.onSelectedNFTsChange).toHaveBeenCalledWith(expect.any(Set));

      const lastCall =
        mockCallbacks.onSelectedNFTsChange.mock.calls[
          mockCallbacks.onSelectedNFTsChange.mock.calls.length - 1
        ][0];
      expect(lastCall.has(mockNFTs[0].id)).toBe(true);
    });
  });
});
