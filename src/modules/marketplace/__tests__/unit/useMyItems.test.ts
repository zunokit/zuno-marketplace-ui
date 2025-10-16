import { renderHook, act } from "@testing-library/react";
import { useMyItems } from "@/modules/marketplace/hooks/useMyItems";

jest.useFakeTimers();

describe("useMyItems", () => {
  it("returns empty when not connected", () => {
    const { result } = renderHook(() =>
      useMyItems({ contractAddress: "0xabc", address: "", isConnected: false })
    );
    expect(result.current.nfts).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  it("loads items after delay when connected", async () => {
    const { result } = renderHook(() =>
      useMyItems({ contractAddress: "0xabc", address: "0x1", isConnected: true })
    );
    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.nfts.length).toBeGreaterThan(0);
  });
});
