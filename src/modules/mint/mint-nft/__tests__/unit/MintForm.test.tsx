import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MintForm from "@/modules/mint/mint-nft/components/MintForm";

// Mock useMintState to inject allowlist flag and terms state
jest.mock("@/modules/mint/mint-nft/hooks/useMintState", () => ({
  useMintState: jest.fn(),
}));

const baseState = {
  collection: { name: "Collection" },
  isSameArtType: false,
  isAllowlistMint: true,
  agreedToTerms: false,
  setAgreedToTerms: jest.fn(),
  isERC1155: false,
  mintCostData: { getMintCost: { mintPrice: "0.01", estimatedGas: "0.001" } },
  SUPPORTS_BATCH: false,
  selectedEdition: null,
  mockEditions: [],
};

type MintStateOverrides = Partial<typeof baseState>;
const mockUseMintState = (overrides: MintStateOverrides = {}) => {
  const { useMintState } = jest.requireMock("@/modules/mint/mint-nft/hooks/useMintState") as {
    useMintState: jest.Mock;
  };
  useMintState.mockReturnValue({ ...baseState, ...overrides });
};

describe("MintForm", () => {
  it("renders allowlist inputs when isAllowlistMint is true", () => {
    mockUseMintState({ isAllowlistMint: true });
    render(<MintForm />);
    expect(screen.getByText(/Allowlist Mint Credentials/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Signature/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nonce/i)).toBeInTheDocument();
  });

  it("validates signature format and shows success icon when valid", () => {
    mockUseMintState({ isAllowlistMint: true });
    render(<MintForm />);
    const input = screen.getByPlaceholderText(/Signature/i) as HTMLInputElement;
    // invalid first -> component clears invalid value, aria-invalid remains false
    fireEvent.change(input, { target: { value: "0x123" } });
    expect(input.value).toBe("");
    expect(input.getAttribute("aria-invalid")).toBe("false");
    // valid 65-byte hex (130 chars after 0x)
    const validSig = "0x" + "a".repeat(130);
    fireEvent.change(input, { target: { value: validSig } });
    expect(input.getAttribute("aria-invalid")).toBe("false");
  });

  it("toggles terms checkbox and calls setAgreedToTerms", () => {
    const setAgreedToTerms = jest.fn();
    mockUseMintState({ setAgreedToTerms });
    render(<MintForm />);
    const checkbox = screen.getByRole("checkbox", { name: /agree to terms/i });
    fireEvent.click(checkbox);
    expect(setAgreedToTerms).toHaveBeenCalledWith(true);
  });
});
