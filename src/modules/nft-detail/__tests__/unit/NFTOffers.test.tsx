import React from "react";
import { render, screen } from "@testing-library/react";
import { NFTOffers } from "@/modules/nft-detail/components/NFTOffers";

describe("NFTOffers", () => {
  it("shows empty state and button when no offers", () => {
    render(<NFTOffers offers={[]} currentPrice="0.1" />);
    expect(screen.getByText(/No offers yet/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Make an Offer/i })).toBeInTheDocument();
  });

  it("renders offer percentage above or below listing", () => {
    const offers = [
      {
        id: "1",
        offerer: { address: "0x1", name: "A", avatar: "" },
        price: "0.12",
        currency: "ETH",
        createdAt: new Date(),
        status: "active" as const,
      },
      {
        id: "2",
        offerer: { address: "0x2", name: "B", avatar: "" },
        price: "0.08",
        currency: "ETH",
        createdAt: new Date(),
        status: "active" as const,
      },
    ];
    render(
      <NFTOffers
        offers={offers as unknown as Parameters<typeof NFTOffers>[0]["offers"]}
        currentPrice="0.1"
      />
    );
    expect(screen.getByText(/\+20\.0% above listing/)).toBeInTheDocument();
    expect(screen.getByText(/-20\.0% below listing/)).toBeInTheDocument();
  });
});
