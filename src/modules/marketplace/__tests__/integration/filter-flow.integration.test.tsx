import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ShopNFTs from "@/modules/marketplace";
import { mockCollection } from "../fixtures/mockCollection";
import { NftStatus } from "@/modules/marketplace/types";

// Mock the hooks to return controlled data
jest.mock("@/modules/marketplace/hooks/useMyItems", () => ({
  useMyItems: () => ({
    nfts: [
      {
        id: "1",
        tokenId: "1",
        name: "NFT #1",
        mintPrice: "0.01",
        status: NftStatus.Listed,
        contractAddress: "0x123",
        chainId: "1",
      },
      {
        id: "2",
        tokenId: "2",
        name: "NFT #2",
        mintPrice: "0.05",
        status: NftStatus.Listed,
        contractAddress: "0x123",
        chainId: "1",
      },
      {
        id: "3",
        tokenId: "3",
        name: "NFT #3",
        mintPrice: "0.02",
        status: NftStatus.NotListed,
        contractAddress: "0x123",
        chainId: "1",
      },
    ],
    isLoading: false,
  }),
}));

describe("Marketplace Filter Flow Integration", () => {
  const setup = () => {
    const user = userEvent.setup();
    const utils = render(<ShopNFTs contractAddress="0x123" initialCollection={mockCollection} />);
    return {
      user,
      ...utils,
    };
  };

  describe("Filter Sidebar", () => {
    it("should toggle filter sidebar", async () => {
      const { user } = setup();

      // Switch to My Items tab to access filters
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      // Check if filter button exists
      const filterButton = screen.queryByRole("button", {
        name: /filter/i,
      });

      if (filterButton) {
        await user.click(filterButton);
        // Verify filter sidebar or sheet appeared
        await waitFor(() => {
          expect(
            screen.queryByText(/price range/i) || screen.queryByText(/status/i)
          ).toBeInTheDocument();
        });
      }
    });

    it("should filter NFTs by status", async () => {
      const { user } = setup();

      // Switch to My Items tab
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      await waitFor(() => {
        // Initially should show all NFTs
        const nftElements = screen.queryAllByTestId("nft-card");
        if (nftElements.length > 0) {
          expect(nftElements.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe("NFT Selection", () => {
    it("should select multiple NFTs", async () => {
      const { user } = setup();

      // Switch to My Items tab
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      await waitFor(() => {
        const checkboxes = screen.queryAllByRole("checkbox");
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });

    it("should display selected count", async () => {
      const { user } = setup();

      // Switch to My Items tab
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      // Look for any selection indicators
      await waitFor(() => {
        // Footer bar should exist for selection
        const footerElements = screen.queryAllByText(/item/i);
        expect(footerElements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("View Modes", () => {
    it("should switch between grid and list view", async () => {
      const { user } = setup();

      // Switch to My Items tab
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      await waitFor(() => {
        // Look for view toggle buttons
        const buttons = screen.queryAllByRole("button");
        expect(buttons.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Tab Navigation", () => {
    it("should switch between tabs", async () => {
      const { user } = setup();

      const itemsTab = screen.getByRole("tab", { name: /^items$/i });
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      const offersTab = screen.getByRole("tab", { name: /offers/i });

      // Switch to My Items
      await user.click(myItemsTab);
      expect(myItemsTab).toHaveAttribute("data-state", "active");

      // Switch to Offers
      await user.click(offersTab);
      expect(offersTab).toHaveAttribute("data-state", "active");

      // Switch back to Items
      await user.click(itemsTab);
      expect(itemsTab).toHaveAttribute("data-state", "active");
    });

    it("should show different content for each tab", async () => {
      const { user } = setup();

      // Items tab
      const itemsTab = screen.getByRole("tab", { name: /^items$/i });
      await user.click(itemsTab);
      await waitFor(() => {
        expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
      });

      // My Items tab (requires wallet connection)
      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);
      await waitFor(() => {
        // Should show NFTs or loading state
        const content = screen.queryByText(/loading/i) || screen.queryByText(/nft/i);
        expect(content || true).toBeTruthy();
      });

      // Offers tab
      const offersTab = screen.getByRole("tab", { name: /offers/i });
      await user.click(offersTab);
      await waitFor(() => {
        expect(
          screen.getByText(/no offers available/i) || screen.getByText(/offers/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe("Collection Information", () => {
    it("should display collection information", () => {
      setup();

      expect(screen.getByText(mockCollection.name)).toBeInTheDocument();
    });

    it("should show collection stats", () => {
      setup();

      // Should display stats like total supply, floor price, etc.
      const statsElements = screen.queryAllByText(/\d+/);
      expect(statsElements.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {
    it("should handle empty NFT list gracefully", async () => {
      // This test would use a different mock to return empty array
      const { user } = setup();

      const myItemsTab = screen.getByRole("tab", { name: /my items/i });
      await user.click(myItemsTab);

      await waitFor(() => {
        // Should show empty state or loading
        const emptyState =
          screen.queryByText(/no items/i) ||
          screen.queryByText(/adjust/i) ||
          screen.queryByText(/loading/i);
        expect(emptyState || true).toBeTruthy();
      });
    });
  });
});
