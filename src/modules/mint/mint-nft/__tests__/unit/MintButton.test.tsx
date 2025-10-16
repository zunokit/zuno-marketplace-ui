import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MintButton from "@/modules/mint/mint-nft/components/MintButton";

// Mock useMintState to control button states
jest.mock("@/modules/mint/mint-nft/hooks/useMintState", () => ({
  useMintState: jest.fn(),
}));

const baseCollection = {
  address: "0xabc",
  name: "Test Collection",
  description: "",
  image: "http://example.com/img.png",
  banner: "",
  verified: true,
  floorPrice: "0.01",
  volume24h: "1",
  totalVolume: "10",
  itemCount: 100,
  ownerCount: 10,
  creator: { address: "0xcreator" },
  maxSupply: "1000",
  totalMinted: "100",
} as unknown as {
  address: string;
  name: string;
  description: string;
  image: string;
  banner: string;
  verified: boolean;
  floorPrice: string;
  volume24h: string;
  totalVolume: string;
  itemCount: number;
  ownerCount: number;
  creator: { address: string };
  maxSupply: string;
  totalMinted: string;
};

type MintStateOverrides = Partial<{
  collection: typeof baseCollection | null;
  isConnected: boolean;
  isSameArtType: boolean;
  isAllowlistMint: boolean;
  agreedToTerms: boolean;
  amount: number;
  signature?: string;
  nonce?: string;
  mintCostData: { getMintCost: { success?: boolean; mintPrice: string; estimatedGas: string } };
  lastMintCost: { mintPrice: string; estimatedGas: string };
  isLoading: boolean;
  handleMintConfirm: jest.Mock;
  isERC1155: boolean;
  isERC721: boolean;
  SUPPORTS_BATCH: boolean;
  selectedEdition: unknown;
  mockEditions: unknown[];
}>;

const mockUseMintState = (overrides: MintStateOverrides = {}) => {
  const { useMintState } = jest.requireMock("@/modules/mint/mint-nft/hooks/useMintState") as {
    useMintState: jest.Mock;
  };
  useMintState.mockReturnValue({
    collection: baseCollection,
    isConnected: true,
    isSameArtType: false,
    isAllowlistMint: false,
    agreedToTerms: true,
    amount: 1,
    signature: undefined,
    nonce: undefined,
    mintCostData: { getMintCost: { success: true, mintPrice: "0.01", estimatedGas: "0.001" } },
    lastMintCost: { mintPrice: "0.01", estimatedGas: "0.001" },
    isLoading: false,
    handleMintConfirm: jest.fn(),
    isERC1155: false,
    isERC721: true,
    SUPPORTS_BATCH: false,
    selectedEdition: null,
    mockEditions: [],
    ...overrides,
  });
};

describe("MintButton", () => {
  it("renders loading when collection is not ready", () => {
    mockUseMintState({ collection: null });
    render(<MintButton />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows connect wallet when not connected", () => {
    mockUseMintState({ isConnected: false });
    render(<MintButton />);
    expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("requires edition selection for ERC-1155", () => {
    mockUseMintState({ isERC1155: true, isERC721: false, selectedEdition: null });
    render(<MintButton />);
    expect(screen.getByText(/select an edition/i)).toBeInTheDocument();
  });

  it("shows sold out when collection is fully minted", () => {
    mockUseMintState({ collection: { ...baseCollection, totalMinted: "1000", maxSupply: "1000" } });
    render(<MintButton />);
    expect(screen.getByText(/sold out/i)).toBeInTheDocument();
  });

  it("requires signature and nonce for allowlist mint", () => {
    mockUseMintState({ isAllowlistMint: true, signature: undefined, nonce: undefined });
    render(<MintButton />);
    expect(screen.getByText(/provide valid signature and nonce/i)).toBeInTheDocument();
  });

  it("disables when terms are not accepted", () => {
    mockUseMintState({ agreedToTerms: false });
    render(<MintButton />);
    expect(screen.getByText(/accept terms of service/i)).toBeInTheDocument();
  });

  it("enables mint and calls confirm on click", () => {
    const handleMintConfirm = jest.fn();
    mockUseMintState({ handleMintConfirm });
    render(<MintButton />);
    const btn = screen.getByRole("button", { name: /mint 1 nft/i });
    expect(btn).not.toBeDisabled();
    fireEvent.click(btn);
    expect(handleMintConfirm).toHaveBeenCalled();
  });
});
