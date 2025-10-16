import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormProvider, useForm } from "react-hook-form";
import { PublicStage } from "@/modules/mint/create-form/components/PublicStage";

function Wrapper({ children }: { children: React.ReactNode }) {
  const methods = useForm({
    defaultValues: {
      mintStartAt: new Date().toISOString(),
      stages: [{ public: { price: "0.01", duration: { days: 0, hours: 0 } } }],
    },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

describe("PublicStage", () => {
  it("updates price field and sanitizes empty value to undefined", () => {
    render(
      <Wrapper>
        <PublicStage isOpen onOpenChange={() => {}} />
      </Wrapper>
    );
    const priceInput = screen.getByPlaceholderText("0.00") as HTMLInputElement;
    fireEvent.change(priceInput, { target: { value: "0.05" } });
    expect(priceInput.value).toBe("0.05");
    // Clear value -> component should not crash and keeps empty string in UI
    fireEvent.change(priceInput, { target: { value: "" } });
    expect(priceInput.value).toBe("");
  });

  it("updates duration days and hours inputs", () => {
    render(
      <Wrapper>
        <PublicStage isOpen onOpenChange={() => {}} />
      </Wrapper>
    );
    const daysInput = screen.getByPlaceholderText("1") as HTMLInputElement;
    const hoursInput = screen.getByPlaceholderText("0") as HTMLInputElement;
    fireEvent.change(daysInput, { target: { value: "2" } });
    fireEvent.change(hoursInput, { target: { value: "5" } });
    expect(daysInput.value).toBe("2");
    expect(hoursInput.value).toBe("5");
  });
});
