import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { MintDetails } from "@/modules/mint/create-form/components/MintDetails";

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      mintPrice: "0.01",
      royaltyPercent: 5,
      maxSupply: 1000,
      mintLimitPerWallet: 3,
      mintStartAt: new Date().toISOString(),
      stages: [{ public: { price: "0.01", duration: { days: 0, hours: 0 } } }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("MintDetails", () => {
  it("renders public stage and allows adding allowlist stage", () => {
    render(
      <Wrapper>
        <MintDetails />
      </Wrapper>
    );

    // Public stage visible (card heading)
    expect(screen.getAllByText(/^Public Stage$/i)[0]).toBeInTheDocument();

    // Click Add Allowlist Stage
    fireEvent.click(screen.getByRole("button", { name: /Add Allowlist Stage/i }));
    // After adding, allowlist card should appear (first heading)
    expect(screen.getAllByText(/^Allowlist Stage$/i)[0]).toBeInTheDocument();
  });
});
