import { renderHook, act } from "@testing-library/react";
import { useMintState } from "@/modules/mint/mint-nft/hooks/useMintState";

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("useMintState Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization", () => {
    it("should initialize with default values", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.agreedToTerms).toBe(false);
      expect(result.current.activeTab).toBe("mint");
      expect(result.current.showConfirmModal).toBe(false);
      expect(result.current.isMintingNft).toBe(false);
      expect(result.current.amount).toBe(1);
    });

    it("should initialize token standard as ERC1155", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.tokenStandard).toBe("ERC1155");
      expect(result.current.isERC1155).toBe(true);
      expect(result.current.isERC721).toBe(false);
    });
  });

  describe("Terms Agreement", () => {
    it("should toggle terms agreement", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.agreedToTerms).toBe(false);

      act(() => {
        result.current.setAgreedToTerms(true);
      });

      expect(result.current.agreedToTerms).toBe(true);
    });
  });

  describe("Token Standard", () => {
    it("should switch between ERC721 and ERC1155", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.tokenStandard).toBe("ERC1155");

      act(() => {
        result.current.setTokenStandard("ERC721");
      });

      expect(result.current.tokenStandard).toBe("ERC721");
      expect(result.current.isERC721).toBe(true);
      expect(result.current.isERC1155).toBe(false);
    });

    it("should reset selected edition when token standard changes", () => {
      const { result } = renderHook(() => useMintState());

      // Select an edition first
      act(() => {
        result.current.setSelectedEdition("1");
      });

      expect(result.current.selectedEdition).toBe("1");

      // Change token standard
      act(() => {
        result.current.setTokenStandard("ERC721");
      });

      // Selected edition should be reset
      expect(result.current.selectedEdition).toBe(null);
    });
  });

  describe("Edition Selection", () => {
    it("should select edition", () => {
      const { result } = renderHook(() => useMintState());

      act(() => {
        result.current.setSelectedEdition("2");
      });

      expect(result.current.selectedEdition).toBe("2");
    });

    it("should clear edition selection", () => {
      const { result } = renderHook(() => useMintState());

      act(() => {
        result.current.setSelectedEdition("2");
      });

      expect(result.current.selectedEdition).toBe("2");

      act(() => {
        result.current.setSelectedEdition(null);
      });

      expect(result.current.selectedEdition).toBe(null);
    });
  });

  describe("Amount Management", () => {
    it("should update mint amount", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.amount).toBe(1);

      act(() => {
        result.current.setAmount(5);
      });

      expect(result.current.amount).toBe(5);
    });

    it("should handle minimum amount", () => {
      const { result } = renderHook(() => useMintState());

      act(() => {
        result.current.setAmount(0);
      });

      // Should allow 0 but validation should happen elsewhere
      expect(result.current.amount).toBe(0);
    });
  });

  describe("Mint Confirmation Flow", () => {
    it("should show confirm modal", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.showConfirmModal).toBe(false);

      act(() => {
        result.current.handleMintConfirm();
      });

      expect(result.current.showConfirmModal).toBe(true);
    });

    it("should handle mint submission", async () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.isMintingNft).toBe(false);

      act(() => {
        result.current.submitMint();
      });

      expect(result.current.isMintingNft).toBe(true);

      // Wait for async operation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 2500));
      });

      expect(result.current.isMintingNft).toBe(false);
      expect(result.current.showConfirmModal).toBe(false);
    });
  });

  describe("Tab Management", () => {
    it("should switch active tab", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.activeTab).toBe("mint");

      act(() => {
        result.current.setActiveTab("overview");
      });

      expect(result.current.activeTab).toBe("overview");
    });
  });

  describe("Image Management", () => {
    it("should set current image", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.currentImage).toBeUndefined();

      act(() => {
        result.current.setCurrentImage("https://example.com/image.jpg");
      });

      expect(result.current.currentImage).toBe("https://example.com/image.jpg");
    });
  });

  describe("Edition Filter and Sort", () => {
    it("should update edition filter", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.editionFilter).toBe("");

      act(() => {
        result.current.setEditionFilter("gold");
      });

      expect(result.current.editionFilter).toBe("gold");
    });

    it("should change edition sort option", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.editionSortBy).toBe("price");

      act(() => {
        result.current.setEditionSortBy("remaining");
      });

      expect(result.current.editionSortBy).toBe("remaining");
    });

    it("should toggle edition view mode", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.editionViewMode).toBe("grid");

      act(() => {
        result.current.setEditionViewMode("list");
      });

      expect(result.current.editionViewMode).toBe("list");
    });
  });

  describe("Mock Data", () => {
    it("should provide mock editions", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.mockEditions).toBeDefined();
      expect(Array.isArray(result.current.mockEditions)).toBe(true);
      expect(result.current.mockEditions.length).toBeGreaterThan(0);
    });

    it("should have valid edition structure", () => {
      const { result } = renderHook(() => useMintState());

      const edition = result.current.mockEditions[0];
      expect(edition).toHaveProperty("id");
      expect(edition).toHaveProperty("name");
      expect(edition).toHaveProperty("price");
      expect(edition).toHaveProperty("remaining");
      expect(edition).toHaveProperty("maxSupply");
    });
  });

  describe("Computed Values", () => {
    it("should compute isSameArtType correctly for ERC1155", () => {
      const { result } = renderHook(() => useMintState());

      act(() => {
        result.current.setTokenStandard("ERC1155");
      });

      expect(result.current.isSameArtType).toBe(true);
    });

    it("should compute isSameArtType correctly for ERC721", () => {
      const { result } = renderHook(() => useMintState());

      act(() => {
        result.current.setTokenStandard("ERC721");
      });

      expect(result.current.isSameArtType).toBe(false);
    });

    it("should provide mint cost data", () => {
      const { result } = renderHook(() => useMintState());

      expect(result.current.mintCostData).toBeDefined();
      expect(result.current.mintCostData.getMintCost).toBeDefined();
    });
  });
});
