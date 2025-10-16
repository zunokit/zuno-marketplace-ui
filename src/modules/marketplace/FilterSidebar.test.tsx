import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import FilterSidebar from "./FilterSidebar";

describe("FilterSidebar", () => {
  const mockOnClose = jest.fn();
  const mockOnPriceRangeChange = jest.fn();
  const mockOnStatusChange = jest.fn();
  const mockOnSortChange = jest.fn();

  const defaultProps = {
    onClose: mockOnClose,
    priceRange: [0, 1] as [number, number],
    onPriceRangeChange: mockOnPriceRangeChange,
    onStatusChange: mockOnStatusChange,
    onSortChange: mockOnSortChange,
    isOpen: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render filter sidebar with all sections", () => {
      render(<FilterSidebar {...defaultProps} />);

      expect(screen.getByText("Filters")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Price Range (ETH)")).toBeInTheDocument();
      expect(screen.getByText("Clear All Filters")).toBeInTheDocument();
    });

    it("should display correct price range values", () => {
      render(<FilterSidebar {...defaultProps} priceRange={[0.5, 0.8]} />);

      expect(screen.getByText("0.5 ETH")).toBeInTheDocument();
      expect(screen.getByText("0.8 ETH")).toBeInTheDocument();
    });
  });

  describe("Status Filter", () => {
    it("should call onStatusChange when selecting 'listed' status", () => {
      render(<FilterSidebar {...defaultProps} />);

      const listedRadio = screen.getByLabelText("Listed");
      fireEvent.click(listedRadio);

      expect(mockOnStatusChange).toHaveBeenCalledWith("listed");
    });

    it("should call onStatusChange when selecting 'not-listed' status", () => {
      render(<FilterSidebar {...defaultProps} />);

      const notListedRadio = screen.getByLabelText("Not Listed");
      fireEvent.click(notListedRadio);

      expect(mockOnStatusChange).toHaveBeenCalledWith("not-listed");
    });

    it("should have 'all' status selected by default", () => {
      render(<FilterSidebar {...defaultProps} />);

      const allRadio = screen.getByLabelText("All Items") as HTMLInputElement;
      expect(allRadio.getAttribute("data-state")).toBe("checked");
    });
  });

  describe("Price Range Filter", () => {
    it("should display price range slider", () => {
      render(<FilterSidebar {...defaultProps} />);

      // Slider has 2 thumbs (min/max), so use getAllByRole
      const sliders = screen.getAllByRole("slider");
      expect(sliders).toHaveLength(2);
    });

    it("should show correct min and max values", () => {
      render(<FilterSidebar {...defaultProps} priceRange={[0.1, 0.9]} />);

      expect(screen.getByText("0.1 ETH")).toBeInTheDocument();
      expect(screen.getByText("0.9 ETH")).toBeInTheDocument();
    });
  });

  describe("Sort Options", () => {
    it("should render sort options on desktop", () => {
      // Mock desktop width
      global.innerWidth = 1024;

      render(<FilterSidebar {...defaultProps} />);

      expect(screen.getByText("Sort By")).toBeInTheDocument();
      expect(screen.getByLabelText("Recently Listed")).toBeInTheDocument();
      expect(screen.getByLabelText("Price: Low to High")).toBeInTheDocument();
      expect(screen.getByLabelText("Price: High to Low")).toBeInTheDocument();
    });

    it("should call onSortChange when selecting sort option", () => {
      global.innerWidth = 1024;
      render(<FilterSidebar {...defaultProps} />);

      const priceLowRadio = screen.getByLabelText("Price: Low to High");
      fireEvent.click(priceLowRadio);

      expect(mockOnSortChange).toHaveBeenCalledWith("price-low");
    });
  });

  describe("Clear All Filters", () => {
    it("should reset all filters when clicking Clear All", () => {
      render(<FilterSidebar {...defaultProps} priceRange={[0.2, 0.8]} />);

      const clearButton = screen.getByText("Clear All Filters");
      fireEvent.click(clearButton);

      expect(mockOnPriceRangeChange).toHaveBeenCalledWith([0, 1]);
      expect(mockOnStatusChange).toHaveBeenCalledWith("all");
      expect(mockOnSortChange).toHaveBeenCalledWith("recent");
    });
  });

  describe("Close Functionality", () => {
    it("should call onClose when clicking close button", () => {
      global.innerWidth = 1024;
      render(<FilterSidebar {...defaultProps} />);

      // Find all buttons and click the one with X icon (first button in header)
      const buttons = screen.getAllByRole("button");
      const closeButton = buttons.find(btn => btn.querySelector("svg.lucide-x"));

      if (closeButton) {
        fireEvent.click(closeButton);
        expect(mockOnClose).toHaveBeenCalled();
      } else {
        // Alternative: find by checking button content
        fireEvent.click(buttons[0]); // X button is typically first
        expect(mockOnClose).toHaveBeenCalled();
      }
    });
  });

  describe("Mobile Responsive", () => {
    it("should render as Sheet on mobile", () => {
      // Mock mobile width
      global.innerWidth = 375;
      global.dispatchEvent(new Event("resize"));

      render(<FilterSidebar {...defaultProps} />);

      // On mobile, sort options should not be visible
      expect(screen.queryByText("Sort By")).not.toBeInTheDocument();
    });
  });
});
