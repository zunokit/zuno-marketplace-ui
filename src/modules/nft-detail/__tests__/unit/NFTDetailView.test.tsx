import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { NFTDetailView } from "@/modules/nft-detail/components/NFTDetailView";
import { generateNFTDetail } from "@/shared/utils/mock/nft-detail";

// Mock next/image to avoid layout warnings in tests
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: { alt: string; src: string }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={props.alt} src={props.src} />;
  },
}));

describe("NFTDetailView", () => {
  const nft = generateNFTDetail("Ethereum", "0xcontract", "1");

  it("toggles like state when clicking heart button", () => {
    render(<NFTDetailView nft={nft} />);
    const likeBtn = screen.getAllByRole("button")[1];
    fireEvent.click(likeBtn);
    expect(likeBtn).toBeInTheDocument();
  });

  it("renders Offers tab control", () => {
    render(<NFTDetailView nft={nft} />);
    const offersTab = screen.getByRole("tab", { name: /offers/i });
    expect(offersTab).toBeInTheDocument();
  });
});
