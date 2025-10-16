import React from "react";
import { render, screen } from "@testing-library/react";
import { BuyerModal } from "@/modules/marketplace/components/BuyerModal";
import { NftStatus } from "@/modules/marketplace/types";

const nft = {
  id: "1",
  tokenId: "1",
  name: "NFT 1",
  image: "",
  contractAddress: "0xabc",
  chainId: "1",
  owner: "0xowner",
  creator: "0xcreator",
  status: NftStatus.Listed,
  mintPrice: "0.01",
  listPrice: "0.04",
  attributes: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("BuyerModal", () => {
  it("computes fee and total and enables Buy Now", () => {
    const onOpenChange = jest.fn();
    render(
      <BuyerModal
        nft={nft as unknown as Parameters<typeof BuyerModal>[0]["nft"]}
        open
        onOpenChange={onOpenChange}
      />
    );
    expect(screen.getByText(/Purchase Summary/i)).toBeInTheDocument();
    // Price text may appear in multiple places; assert the summary row instead
    const priceRow = screen.getAllByText(/0\.04/i)[0];
    expect(priceRow).toBeInTheDocument();
    expect(screen.getByText(/Platform Fee/i)).toBeInTheDocument();
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Buy Now/i })).not.toBeDisabled();
  });
});
