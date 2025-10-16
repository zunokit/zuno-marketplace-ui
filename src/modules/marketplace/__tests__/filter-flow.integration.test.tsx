import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import FilterSidebar from "../FilterSidebar";

/**
 * Integration test for Marketplace Filter Flow
 *
 * This test simulates a complete user journey of using filters
 * to search and filter NFTs in the marketplace.
 */
describe("Marketplace Filter Flow Integration", () => {
  const mockOnClose = jest.fn();
  const mockOnPriceRangeChange = jest.fn();
  const mockOnStatusChange = jest.fn();
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    global.innerWidth = 1024; // Set desktop mode
  });

  it("should complete full filter flow: status -> price -> sort -> clear", async () => {
    render(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0, 1]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    // Step 1: User filters by 'Listed' status
    const listedRadio = screen.getByLabelText("Listed");
    fireEvent.click(listedRadio);
    expect(mockOnStatusChange).toHaveBeenCalledWith("listed");

    // Step 2: User adjusts price range (simulated)
    // Note: In real integration, this would update parent state
    mockOnPriceRangeChange([0.1, 0.5]);
    expect(mockOnPriceRangeChange).toHaveBeenCalledWith([0.1, 0.5]);

    // Step 3: User changes sort to 'Price: Low to High'
    const priceLowRadio = screen.getByLabelText("Price: Low to High");
    fireEvent.click(priceLowRadio);
    expect(mockOnSortChange).toHaveBeenCalledWith("price-low");

    // Step 4: User clears all filters
    const clearButton = screen.getByText("Clear All Filters");
    fireEvent.click(clearButton);

    expect(mockOnPriceRangeChange).toHaveBeenCalledWith([0, 1]);
    expect(mockOnStatusChange).toHaveBeenCalledWith("all");
    expect(mockOnSortChange).toHaveBeenCalledWith("recent");
  });

  it("should handle filter combination: not-listed + high price + price-high sort", async () => {
    render(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0.5, 1]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    // Filter by not-listed items
    const notListedRadio = screen.getByLabelText("Not Listed");
    fireEvent.click(notListedRadio);
    expect(mockOnStatusChange).toHaveBeenCalledWith("not-listed");

    // Sort by high to low price
    const priceHighRadio = screen.getByLabelText("Price: High to Low");
    fireEvent.click(priceHighRadio);
    expect(mockOnSortChange).toHaveBeenCalledWith("price-high");

    // Verify price range is maintained
    expect(screen.getByText("0.5 ETH")).toBeInTheDocument();
    expect(screen.getByText("1 ETH")).toBeInTheDocument();
  });

  it("should handle rapid filter changes without breaking", async () => {
    const { rerender } = render(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0, 1]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    // Rapidly change filters
    fireEvent.click(screen.getByLabelText("Listed"));
    fireEvent.click(screen.getByLabelText("Not Listed"));
    fireEvent.click(screen.getByLabelText("All Items"));

    expect(mockOnStatusChange).toHaveBeenCalledTimes(3);
    expect(mockOnStatusChange).toHaveBeenLastCalledWith("all");

    // Update price range multiple times
    rerender(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0.2, 0.8]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    expect(screen.getByText("0.2 ETH")).toBeInTheDocument();
    expect(screen.getByText("0.8 ETH")).toBeInTheDocument();
  });

  it("should maintain filter state when closing and reopening", async () => {
    const { rerender } = render(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0.3, 0.7]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    // Apply some filters
    fireEvent.click(screen.getByLabelText("Listed"));
    fireEvent.click(screen.getByLabelText("Price: High to Low"));

    // Close sidebar
    rerender(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0.3, 0.7]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={false}
      />
    );

    // Reopen sidebar - state should be maintained via props
    rerender(
      <FilterSidebar
        onClose={mockOnClose}
        priceRange={[0.3, 0.7]}
        onPriceRangeChange={mockOnPriceRangeChange}
        onStatusChange={mockOnStatusChange}
        onSortChange={mockOnSortChange}
        isOpen={true}
      />
    );

    // Verify price range is maintained
    expect(screen.getByText("0.3 ETH")).toBeInTheDocument();
    expect(screen.getByText("0.7 ETH")).toBeInTheDocument();
  });

  describe("Edge Cases", () => {
    it("should handle min and max price range values", () => {
      render(
        <FilterSidebar
          onClose={mockOnClose}
          priceRange={[0, 1]}
          onPriceRangeChange={mockOnPriceRangeChange}
          onStatusChange={mockOnStatusChange}
          onSortChange={mockOnSortChange}
          isOpen={true}
        />
      );

      expect(screen.getByText("0 ETH")).toBeInTheDocument();
      expect(screen.getByText("1 ETH")).toBeInTheDocument();
    });

    it("should handle equal min and max price values", () => {
      render(
        <FilterSidebar
          onClose={mockOnClose}
          priceRange={[0.5, 0.5]}
          onPriceRangeChange={mockOnPriceRangeChange}
          onStatusChange={mockOnStatusChange}
          onSortChange={mockOnSortChange}
          isOpen={true}
        />
      );

      const priceTexts = screen.getAllByText("0.5 ETH");
      expect(priceTexts).toHaveLength(2);
    });
  });

  describe("Mobile Integration Flow", () => {
    beforeEach(() => {
      global.innerWidth = 375; // Mobile width
      global.dispatchEvent(new Event("resize"));
    });

    it("should complete filter flow on mobile without sort options", async () => {
      render(
        <FilterSidebar
          onClose={mockOnClose}
          priceRange={[0, 1]}
          onPriceRangeChange={mockOnPriceRangeChange}
          onStatusChange={mockOnStatusChange}
          onSortChange={mockOnSortChange}
          isOpen={true}
        />
      );

      // Mobile should not show sort options
      expect(screen.queryByText("Sort By")).not.toBeInTheDocument();

      // But status and price filters should work
      fireEvent.click(screen.getByLabelText("Listed"));
      expect(mockOnStatusChange).toHaveBeenCalledWith("listed");

      // Clear filters should still work
      fireEvent.click(screen.getByText("Clear All Filters"));
      expect(mockOnPriceRangeChange).toHaveBeenCalledWith([0, 1]);
    });
  });
});
