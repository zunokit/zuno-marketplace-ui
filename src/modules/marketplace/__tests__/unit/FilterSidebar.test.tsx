import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSidebar from "@/modules/marketplace/components/FilterSidebar";

describe("FilterSidebar", () => {
  const setup = () => {
    const onClose = jest.fn();
    const onPriceRangeChange = jest.fn();
    const onStatusChange = jest.fn();
    const onSortChange = jest.fn();
    render(
      <FilterSidebar
        onClose={onClose}
        priceRange={[0, 1]}
        onPriceRangeChange={onPriceRangeChange}
        onStatusChange={onStatusChange}
        onSortChange={onSortChange}
        isOpen
      />
    );
    return { onClose, onPriceRangeChange, onStatusChange, onSortChange };
  };

  it("changes status via radio buttons", () => {
    const { onStatusChange } = setup();
    fireEvent.click(screen.getByLabelText(/^Listed$/i));
    expect(onStatusChange).toHaveBeenCalledWith("listed");
  });

  it("clears all filters on button click", () => {
    const { onPriceRangeChange, onStatusChange, onSortChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: /clear all filters/i }));
    expect(onPriceRangeChange).toHaveBeenCalledWith([0, 1]);
    expect(onStatusChange).toHaveBeenCalledWith("all");
    expect(onSortChange).toHaveBeenCalledWith("recent");
  });
});
