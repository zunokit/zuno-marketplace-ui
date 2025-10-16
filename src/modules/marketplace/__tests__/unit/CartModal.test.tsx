import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CartModal from "@/modules/marketplace/components/CartModal";

const makeItem = (id: string, price: string) => ({
  id,
  tokenId: id,
  name: `NFT ${id}`,
  image: "",
  contractAddress: "0xabc",
  chainId: "1",
  owner: "0xowner",
  creator: "0xcreator",
  status: 0,
  mintPrice: price,
  listPrice: price,
  attributes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

describe("CartModal", () => {
  it("shows totals and triggers actions", () => {
    const onOpenChange = jest.fn();
    const onRemoveItem = jest.fn();
    const onBuy = jest.fn();
    const onClearAllItems = jest.fn();
    const items = [makeItem("1", "0.01"), makeItem("2", "0.02")];

    render(
      <CartModal
        open
        onOpenChange={onOpenChange}
        items={items}
        onRemoveItem={onRemoveItem}
        onBuy={onBuy}
        type="buyer"
        listingStep={0}
        onClearAllItems={onClearAllItems}
      />
    );

    expect(screen.getByText(/Subtotal \(2 items\)/i)).toBeInTheDocument();
    expect(screen.getAllByText(/0\.0300 ETH/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: /Clear All/i }));
    expect(onClearAllItems).toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: /Purchase/i }));
    expect(onBuy).toHaveBeenCalled();
  });
});
